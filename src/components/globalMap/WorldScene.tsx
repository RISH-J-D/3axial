import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { generateStructure, I_SECTION, PROFILE, ROUND, SLAB } from './structures';
import type { Fixture, Member, Panel, PanelKind, Structure, V3 } from './structures';

/* ------------------------------------------------------------------
   Map frame
------------------------------------------------------------------- */

const K = 0.1; // world units per degree
const LAND_H = 0.08;
const VIEW = { w: 35.5, h: 13.2, cx: 1.4, cz: -1.6 };
const ELEVATION = THREE.MathUtils.degToRad(58);
const CAM_DIR = new THREE.Vector3(0, Math.sin(ELEVATION), Math.cos(ELEVATION));
const TARGET = new THREE.Vector3(VIEW.cx, 0, VIEW.cz);
const LIGHT_DIR = new THREE.Vector3(-6, 12, 8).normalize();

const toWorld = (lon: number, lat: number, y = LAND_H) => new THREE.Vector3(lon * K, y, -lat * K);

export type SiteDef = { city: string; country: string; lon: number; lat: number; at: [number, number] };
const HQ_DEF = { city: 'Bengaluru', country: 'India', lon: 77.59, lat: 12.97 };

const COLOR = {
  land: '#F47106',
  coast: '#C45500',
  landSide: '#B85200',
  border: '#FFD3AD',
  graticule: '#DDE2E9',
  ink: '#14213D',
  steel: '#424C5B',
  steelIssued: '#2F6B45',
  pipe: '#8E98A6',
  deck: '#B7BDC6',
  roof: '#C9D0D9',
  wall: '#E6E9ED',
  slab: '#DDE0E4',
  earth: '#CFC6B8',
  crane: '#E2A60F',
  craneDark: '#2B3340',
  counterweight: '#9AA1AA',
  glass: '#6F8DB2',
  mullion: '#E4E9F0',
  accent: '#F47106'
};

const STEEL = new THREE.Color(COLOR.steel);
const STEEL_ISSUED = new THREE.Color(COLOR.steelIssued);
const SITE_ROTATION = -0.6;
const GLASS_OPACITY = 0.55;
const DROP = 0.55;
const UNROLL_S = 1.1;
const GROW_S = 0.6;
const HOLD_S = 4.5;
const FADE_S = 1.2;
const PACKET_S = 2.6;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------
   Land, borders and graticule (fetched once, merged into a few draw calls)
------------------------------------------------------------------- */

type WorldData = { q: number; land: number[][][]; borders: number[][] };

const decode = (ring: number[], q: number) => {
  const out: [number, number][] = [];
  let x = 0, y = 0;
  for (let i = 0; i < ring.length; i += 2) {
    x += ring[i];
    y += ring[i + 1];
    out.push([x / q, y / q]);
  }
  return out;
};

// Rings that cross the antimeridian (eastern Russia, Fiji) lose the off-screen sliver on the far side,
// which would otherwise fold back along the 180° line and break triangulation.
const unwrap = (ring: [number, number][]) => {
  if (!ring.some((p, i) => i > 0 && Math.abs(p[0] - ring[i - 1][0]) > 180)) return ring;
  const east = ring.filter((p) => p[0] > 0).length >= ring.length / 2;
  return ring.filter(([lon]) => (east ? lon > -90 : lon < 90));
};

const segments = (lines: [number, number][][], y: number, closed: boolean) => {
  const pos: number[] = [];
  for (const line of lines) {
    const n = closed ? line.length : line.length - 1;
    for (let i = 0; i < n; i++) {
      const [a, b] = [line[i], line[(i + 1) % line.length]];
      if (Math.abs(a[0] - b[0]) > 90) continue; // wraps across the antimeridian
      pos.push(a[0] * K, y, -a[1] * K, b[0] * K, y, -b[1] * K);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
};

const buildWorld = (data: WorldData) => {
  const shapes: THREE.Shape[] = [];
  const rings: [number, number][][] = [];
  for (const poly of data.land) {
    const [outer, ...holes] = poly.map((r) => unwrap(decode(r, data.q)));
    rings.push(outer, ...holes);
    if (outer.length < 3) continue;
    const shape = new THREE.Shape(outer.map(([lon, lat]) => new THREE.Vector2(lon * K, lat * K)));
    shape.holes = holes.map((h) => new THREE.Path(h.map(([lon, lat]) => new THREE.Vector2(lon * K, lat * K))));
    shapes.push(shape);
  }
  const fill = new THREE.ExtrudeGeometry(shapes, { depth: LAND_H, bevelEnabled: false, curveSegments: 1 });
  fill.rotateX(-Math.PI / 2);
  return {
    fill,
    coast: segments(rings, LAND_H + 0.002, true),
    borders: segments(data.borders.map((b) => decode(b, data.q)), LAND_H + 0.003, false)
  };
};

let worldData: Promise<WorldData> | null = null;
const loadWorld = () => (worldData ??= fetch('/geo/world-50m.json').then((r) => r.json() as Promise<WorldData>));

// Outer land rings with their bounds, for testing whether a point is ashore
type Ring = { pts: [number, number][]; box: [number, number, number, number] };
let landRings: Promise<Ring[]> | null = null;
const loadLandRings = () =>
  (landRings ??= loadWorld().then((d) =>
    d.land.map((poly) => {
      const pts = unwrap(decode(poly[0], d.q));
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      return { pts, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] as Ring['box'] };
    })
  ));
const ashore = (rings: Ring[], lon: number, lat: number) =>
  rings.some(({ pts, box }) => {
    if (lon < box[0] || lon > box[2] || lat < box[1] || lat > box[3]) return false;
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });

const graticule = (() => {
  const lines: [number, number][][] = [];
  for (let lon = -150; lon <= 180; lon += 15) lines.push([[lon, 80], [lon, -55]]);
  for (let lat = -45; lat <= 75; lat += 15) lines.push([[-150, lat], [180, lat]]);
  return segments(lines, 0, false);
})();

// Soft, seamless mottling and grain so the land reads as ground rather than a flat fill
const landTexture = () => {
  const N = 256, cells = 6;
  const r = (() => {
    let seed = 7;
    return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  })();
  const grid = (n: number) => Array.from({ length: n * n }, r);
  const octaves = [cells, cells * 2, cells * 4].map((n) => ({ n, g: grid(n) }));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = ({ n, g }: { n: number; g: number[] }, u: number, v: number) => {
    const x = u * n, y = v * n, x0 = Math.floor(x), y0 = Math.floor(y), fx = smooth(x - x0), fy = smooth(y - y0);
    const at = (i: number, j: number) => g[((j % n) * n + (i % n)) % (n * n)];
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const bot = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return top + (bot - top) * fy;
  };
  return canvasTexture(N, N, (ctx) => {
    const img = ctx.createImageData(N, N);
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const u = i / N, v = j / N;
        const n = noise(octaves[0], u, v) * 0.55 + noise(octaves[1], u, v) * 0.3 + noise(octaves[2], u, v) * 0.15;
        const val = 255 * (0.93 + n * 0.07 - r() * 0.025);
        const k = (j * N + i) * 4;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = val;
        img.data[k + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  });
};

const oceanTexture = () =>
  canvasTexture(512, 256, (g) => {
    g.fillStyle = 'rgba(0,0,0,0)';
    g.fillRect(0, 0, 512, 256);
    g.save();
    g.scale(1, 0.5);
    const grad = g.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, 'rgba(206,220,234,0.6)');
    grad.addColorStop(0.55, 'rgba(206,220,234,0.4)');
    grad.addColorStop(1, 'rgba(206,220,234,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    g.restore();
  });

// Studio reflections for metal and glass; the land is matte so it stays flat
const Reflections: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.35;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);
  return null;
};

const World: React.FC = () => {
  const ocean = useMemo(() => oceanTexture(), []);
  const landMats = useMemo(() => {
    const map = landTexture();
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(0.7, 0.7);
    return [
      new THREE.MeshStandardMaterial({ color: COLOR.land, map, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: COLOR.landSide, roughness: 0.95 })
    ];
  }, []);
  const [geo, setGeo] = useState<ReturnType<typeof buildWorld> | null>(null);
  useEffect(() => {
    let alive = true;
    loadWorld()
      .then((d) => alive && setGeo(buildWorld(d)))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <group>
      <lineSegments geometry={graticule}>
        <lineBasicMaterial color={COLOR.graticule} />
      </lineSegments>
      <mesh rotation-x={-Math.PI / 2} position={[VIEW.cx, -0.004, VIEW.cz]}>
        <planeGeometry args={[VIEW.w + 2, VIEW.h / Math.sin(ELEVATION) + 1]} />
        <meshBasicMaterial map={ocean} transparent depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.002} receiveShadow>
        <planeGeometry args={[80, 40]} />
        <shadowMaterial opacity={0.07} />
      </mesh>
      {geo && (
        <>
          <mesh geometry={geo.fill} material={landMats} receiveShadow />
          <lineSegments geometry={geo.coast}>
            <lineBasicMaterial color={COLOR.coast} transparent opacity={0.55} />
          </lineSegments>
          <lineSegments geometry={geo.borders}>
            <lineBasicMaterial color={COLOR.border} transparent opacity={0.85} />
          </lineSegments>
        </>
      )}
    </group>
  );
};

/* ------------------------------------------------------------------
   Structure erection
------------------------------------------------------------------- */

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
// Wide-flange section, unit width and depth, extruded one unit along z
const UNIT_I = (() => {
  const tf = 0.17, tw = 0.13;
  const pts: [number, number][] = [
    [-0.5, -0.5], [0.5, -0.5], [0.5, -0.5 + tf], [tw / 2, -0.5 + tf], [tw / 2, 0.5 - tf], [0.5, 0.5 - tf],
    [0.5, 0.5], [-0.5, 0.5], [-0.5, 0.5 - tf], [-tw / 2, 0.5 - tf], [-tw / 2, -0.5 + tf], [-0.5, -0.5 + tf]
  ];
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 1, bevelEnabled: false });
  g.translate(0, 0, -0.5);
  return g;
})();
const PANEL_KINDS: PanelKind[] = ['deck', 'roof', 'wall', 'glass', 'belt'];
const PANEL_T: Record<PanelKind, number> = { deck: 0.03, roof: 0.014, wall: 0.014, glass: 0.01, belt: 0.016 };
type Shape = 'i' | 'box' | 'cyl';
const shapeOf = (m: Member): Shape => (ROUND[m.kind] ? 'cyl' : I_SECTION[m.kind] ? 'i' : 'box');
const HIDDEN = new THREE.Matrix4().makeScale(1e-5, 1e-5, 1e-5);

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3();
const _u = new THREE.Vector3(), _v = new THREE.Vector3(), _n = new THREE.Vector3(), _c = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0), SIDE = new THREE.Vector3(1, 0, 0);

const memberMatrix = (m: Member, out: THREE.Matrix4, lift = 0) => {
  _a.fromArray(m.a);
  _b.fromArray(m.b);
  _z.subVectors(_b, _a);
  const len = _z.length();
  _z.divideScalar(len);
  _x.crossVectors(Math.abs(_z.y) > 0.95 ? SIDE : UP, _z).normalize();
  _y.crossVectors(_z, _x);
  _c.addVectors(_a, _b).multiplyScalar(0.5);
  _c.y += lift;
  if (ROUND[m.kind]) {
    const d = m.size ?? PROFILE[m.kind][0];
    // Cylinder axis is local y; keep the basis right-handed so instanced normals stay correct.
    out.makeBasis(_x.multiplyScalar(d), _z.multiplyScalar(len), _y.multiplyScalar(-d));
  } else {
    const [w, d] = PROFILE[m.kind];
    out.makeBasis(_x.multiplyScalar(w), _y.multiplyScalar(d), _z.multiplyScalar(len));
  }
  return out.setPosition(_c);
};

const panelMatrix = (p: Panel, out: THREE.Matrix4, extent = 1) => {
  _u.fromArray(p.u);
  _v.fromArray(p.v).multiplyScalar(extent);
  _n.crossVectors(_v, _u).normalize().multiplyScalar(PANEL_T[p.kind]);
  _c.fromArray(p.o).addScaledVector(_u, 0.5).addScaledVector(_v, 0.5);
  return out.makeBasis(_u, _n, _v).setPosition(_c);
};

// Fixtures grow out from their start point; round ones are cylinders of diameter w.
const fixtureMatrix = (f: Fixture, out: THREE.Matrix4, grow = 1) => {
  _a.fromArray(f.a);
  _b.fromArray(f.b);
  _z.subVectors(_b, _a);
  const len = Math.max(1e-4, _z.length() * grow);
  _z.normalize();
  _x.crossVectors(Math.abs(_z.y) > 0.95 ? SIDE : UP, _z).normalize();
  _y.crossVectors(_z, _x);
  _c.copy(_a).addScaledVector(_z, len / 2);
  if (f.round) out.makeBasis(_x.multiplyScalar(f.w), _z.multiplyScalar(len), _y.multiplyScalar(-f.w));
  else out.makeBasis(_x.multiplyScalar(f.w), _y.multiplyScalar(f.d), _z.multiplyScalar(len));
  return out.setPosition(_c);
};

/* Surface finishes drawn once on small canvases: profiled sheeting ribs and curtain-wall mullions */

const canvasTexture = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

const ribbed = (base: string, light: string, dark: string, ribs: number) =>
  canvasTexture(256, 4, (g) => {
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 4);
    const p = 256 / ribs;
    for (let i = 0; i < ribs; i++) {
      g.fillStyle = light;
      g.fillRect(i * p, 0, p * 0.16, 4);
      g.fillStyle = dark;
      g.fillRect(i * p + p * 0.16, 0, p * 0.08, 4);
    }
  });

let textures: { roof: THREE.Texture; wall: THREE.Texture; glass: THREE.Texture } | null = null;
const siteTextures = () =>
  (textures ??= {
    roof: ribbed('#C7CED7', '#E3E8EE', '#9AA3AE', 11),
    wall: ribbed('#E4E7EB', '#F4F6F8', '#BCC3CC', 11),
    glass: canvasTexture(128, 128, (g) => {
      g.fillStyle = '#9CB8D6';
      g.fillRect(0, 0, 128, 128);
      // Spandrel band at the slab edge, then the mullion and transom grid
      g.fillStyle = '#4F617A';
      g.fillRect(0, 104, 128, 24);
      g.fillStyle = '#EEF2F6';
      g.fillRect(0, 0, 128, 5);
      g.fillRect(0, 100, 128, 5);
      for (const x of [0, 42, 85, 123]) g.fillRect(x, 0, 5, 104);
      g.fillRect(0, 70, 128, 3);
    })
  });

// A thin straight member of square section t, used for crane lattices
type Seg = { a: V3; b: V3; t: number };
const segMatrix = (sg: Seg, out: THREE.Matrix4) => {
  _a.fromArray(sg.a);
  _b.fromArray(sg.b);
  _z.subVectors(_b, _a);
  const len = _z.length();
  _z.divideScalar(len);
  _x.crossVectors(Math.abs(_z.y) > 0.95 ? SIDE : UP, _z).normalize();
  _y.crossVectors(_z, _x);
  _c.addVectors(_a, _b).multiplyScalar(0.5);
  return out.makeBasis(_x.multiplyScalar(sg.t), _y.multiplyScalar(sg.t), _z.multiplyScalar(len)).setPosition(_c);
};

const Lattice: React.FC<{ segs: Seg[]; material: THREE.Material }> = ({ segs, material }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    segs.forEach((sg, i) => mesh.setMatrixAt(i, segMatrix(sg, m)));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [segs]);
  return <instancedMesh ref={ref} args={[UNIT_BOX, material, segs.length]} castShadow />;
};

// Tower crane lattice: a square mast, a triangular jib and a flat counter-jib, with the cat-head and tie bars.
// The mast is built from its base; the slewing parts are relative to the top of the mast.
const MAST = 0.13;
const buildCrane = (height: number, reach: number) => {
  const mast: Seg[] = [];
  const h = MAST / 2;
  const corners: [number, number][] = [[-h, -h], [h, -h], [h, h], [-h, h]];
  for (const [x, z] of corners) mast.push({ a: [x, 0, z], b: [x, height, z], t: 0.02 });
  const n = Math.max(2, Math.round(height / MAST));
  const p = height / n;
  for (let k = 0; k <= n; k++) {
    const y = k * p;
    for (let c = 0; c < 4; c++) {
      const [x0, z0] = corners[c], [x1, z1] = corners[(c + 1) % 4];
      mast.push({ a: [x0, y, z0], b: [x1, y, z1], t: 0.01 });
      if (k < n) {
        const flip = (k + c) % 2 === 0;
        mast.push({ a: [flip ? x0 : x1, y, flip ? z0 : z1], b: [flip ? x1 : x0, y + p, flip ? z1 : z0], t: 0.008 });
      }
    }
  }

  const slew: Seg[] = [];
  const apex: V3 = [0, 0.36, 0];
  for (const [x, z] of [[-0.045, -0.045], [0.045, -0.045], [0.045, 0.045], [-0.045, 0.045]]) slew.push({ a: [x, 0.03, z], b: apex, t: 0.016 });
  // Jib
  const j0 = 0.06, j1 = reach + 0.1, jy = -0.035, jt = 0.05, jz = 0.036;
  slew.push({ a: [j0, jy, -jz], b: [j1, jy, -jz], t: 0.014 }, { a: [j0, jy, jz], b: [j1, jy, jz], t: 0.014 }, { a: [j0, jt, 0], b: [j1 - 0.06, jt, 0], t: 0.014 });
  const jn = Math.max(3, Math.round((j1 - j0) / 0.1));
  for (let k = 0; k <= jn; k++) {
    const x = j0 + ((j1 - j0) * k) / jn, xn = j0 + ((j1 - j0) * (k + 1)) / jn;
    slew.push({ a: [x, jy, -jz], b: [x, jy, jz], t: 0.007 });
    if (k < jn) {
      const top = Math.min(xn, j1 - 0.06);
      slew.push({ a: [x, jy, -jz], b: [top, jt, 0], t: 0.007 }, { a: [x, jy, jz], b: [top, jt, 0], t: 0.007 });
      slew.push({ a: [x, jy, k % 2 ? -jz : jz], b: [xn, jy, k % 2 ? jz : -jz], t: 0.006 });
    }
  }
  // Counter-jib with walkway frame
  const c1 = -reach * 0.34, cz = 0.05;
  slew.push({ a: [0, 0, -cz], b: [c1, 0, -cz], t: 0.016 }, { a: [0, 0, cz], b: [c1, 0, cz], t: 0.016 });
  const cn = Math.max(2, Math.round(-c1 / 0.1));
  for (let k = 0; k <= cn; k++) {
    const x = (c1 * k) / cn;
    slew.push({ a: [x, 0, -cz], b: [x, 0, cz], t: 0.008 });
  }
  // Tie bars from the cat-head
  slew.push({ a: apex, b: [reach * 0.58, jt, 0], t: 0.006 }, { a: apex, b: [reach * 0.3, jt, 0], t: 0.006 });
  slew.push({ a: apex, b: [c1 + 0.02, 0, -cz], t: 0.006 }, { a: apex, b: [c1 + 0.02, 0, cz], t: 0.006 });
  return { mast, slew };
};

// Connection hardware drawn with each member once it is bolted up: gusset plates at brace ends,
// end plates at beam and girder ends.
const detailMatrices = (m: Member): THREE.Matrix4[] => {
  const kind = m.kind;
  const gusset = kind === 'brace' || kind === 'rod';
  const endPlate = kind === 'beam' || kind === 'girder';
  if (!gusset && !endPlate) return [];
  _a.fromArray(m.a);
  _b.fromArray(m.b);
  _z.subVectors(_b, _a);
  const len = _z.length();
  _z.divideScalar(len);
  _x.crossVectors(Math.abs(_z.y) > 0.95 ? SIDE : UP, _z).normalize();
  _y.crossVectors(_z, _x);
  const out: THREE.Matrix4[] = [];
  for (const [end, sgn] of [[_a, 1], [_b, -1]] as const) {
    const mat = new THREE.Matrix4();
    if (gusset) {
      _c.copy(end).addScaledVector(_z, sgn * Math.min(0.05, len * 0.2));
      mat.makeBasis(_x.clone().multiplyScalar(0.008), _y.clone().multiplyScalar(0.08), _z.clone().multiplyScalar(0.1));
    } else {
      const [w, d] = PROFILE[kind];
      _c.copy(end).addScaledVector(_z, sgn * 0.008);
      mat.makeBasis(_x.clone().multiplyScalar(w * 1.35), _y.clone().multiplyScalar(d * 1.2), _z.clone().multiplyScalar(0.012));
    }
    out.push(mat.setPosition(_c));
  }
  return out;
};

type Timeline = { spacing: number; memberStart: number[]; panelStart: number[]; fixtureStart: number[]; total: number };

const planTimeline = (s: Structure): Timeline => {
  const n = s.members.length;
  const spacing = (s.duration * 0.85) / n;
  const memberStart = s.members.map((_, i) => i * spacing);
  const panelStart = s.panels.map((p) => (p.after > 0 ? p.after * spacing : 0));
  // Fixtures released together are fitted one after another
  let rank = 0;
  const fixtureStart = s.fixtures.map((f, j) => {
    rank = j > 0 && s.fixtures[j - 1].after === f.after ? rank + 1 : 0;
    return f.after * spacing + Math.min(rank * 0.035, 3);
  });
  const total = Math.max(n * spacing, ...panelStart.map((t) => t + UNROLL_S), ...fixtureStart.map((t) => t + GROW_S)) + 0.4;
  return { spacing, memberStart, panelStart, fixtureStart, total };
};

type SiteMaterials = Record<'steel' | 'pipe' | 'static' | 'fixture' | PanelKind, THREE.MeshStandardMaterial>;

const Erection: React.FC<{ s: Structure; plan: Timeline; time: React.RefObject<number>; mats: SiteMaterials }> = ({ s, plan, time, mats }) => {
  const iRef = useRef<THREE.InstancedMesh>(null);
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const cylRef = useRef<THREE.InstancedMesh>(null);
  const memberRefs = useMemo(() => ({ i: iRef, box: boxRef, cyl: cylRef }), []);
  const deckRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);
  const wallRef = useRef<THREE.InstancedMesh>(null);
  const glassRef = useRef<THREE.InstancedMesh>(null);
  const beltRef = useRef<THREE.InstancedMesh>(null);
  const panelRefs = useMemo(() => ({ deck: deckRef, roof: roofRef, wall: wallRef, glass: glassRef, belt: beltRef }), []);
  const stackRefs = useRef<(THREE.Mesh | null)[]>([]);
  const staticRefs = useRef<(THREE.Mesh | null)[]>([]);
  const slewRef = useRef<THREE.Group>(null);
  const trolleyRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Mesh>(null);
  const cableRef = useRef<THREE.BufferGeometry>(null);
  const detailRef = useRef<THREE.InstancedMesh>(null);
  const fixBoxRef = useRef<THREE.InstancedMesh>(null);
  const fixCylRef = useRef<THREE.InstancedMesh>(null);
  const crane = useMemo(() => buildCrane(s.crane.height, s.crane.reach), [s]);
  const details = useMemo(() => {
    const start: number[] = [];
    const mats: THREE.Matrix4[] = [];
    s.members.forEach((m) => {
      start.push(mats.length);
      mats.push(...detailMatrices(m));
    });
    start.push(mats.length);
    return { start, mats };
  }, [s]);

  const layout = useMemo(() => {
    const count: Record<Shape, number> = { i: 0, box: 0, cyl: 0 };
    const slot = s.members.map((m) => {
      const shape = shapeOf(m);
      return { shape, i: count[shape]++ };
    });
    const pslot: number[] = [];
    const pcount: Record<PanelKind, number> = { deck: 0, roof: 0, wall: 0, glass: 0, belt: 0 };
    s.panels.forEach((p) => pslot.push(pcount[p.kind]++));
    const fcount = { box: 0, cyl: 0 };
    const fslot = s.fixtures.map((f) => (f.round ? fcount.cyl++ : fcount.box++));
    return { slot, count, pslot, pcount, fslot, fcount };
  }, [s]);

  const cursor = useRef({ member: 0, panel: 0, fixture: 0, angle: Math.PI / 4, radius: s.crane.reach * 0.5, hookY: s.crane.height * 0.6 });
  const tmp = useMemo(() => new THREE.Matrix4(), []);

  useLayoutEffect(() => {
    const color = new THREE.Color();
    s.members.forEach((m, i) => {
      const { shape, i: k } = layout.slot[i];
      const mesh = memberRefs[shape].current;
      mesh?.setMatrixAt(k, HIDDEN);
      if (shape === 'cyl') mesh?.setColorAt(k, color.set(m.color ?? COLOR.pipe));
      // Slight shade variation between pieces, as primed steel from different heats and suppliers reads
      else mesh?.setColorAt(k, color.setScalar((m.kind === 'girder' || m.kind === 'col' ? 0.92 : 1.0) + (((i * 2654435761) >>> 0) % 100) / 1400));
    });
    for (const mesh of [iRef.current, boxRef.current, cylRef.current]) if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
    details.mats.forEach((_, k) => detailRef.current?.setMatrixAt(k, HIDDEN));
    s.panels.forEach((p, j) => panelRefs[p.kind].current?.setMatrixAt(layout.pslot[j], HIDDEN));
    s.fixtures.forEach((f, j) => {
      const mesh = (f.round ? fixCylRef : fixBoxRef).current;
      mesh?.setMatrixAt(layout.fslot[j], HIDDEN);
      mesh?.setColorAt(layout.fslot[j], color.set(f.color));
    });
    for (const mesh of [fixBoxRef.current, fixCylRef.current]) if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [layout, s, panelRefs, memberRefs, details]);

  useFrame((_, dt) => {
    const T = time.current;
    const c = cursor.current;
    const touched = new Set<THREE.InstancedMesh>();
    const meshFor = (i: number) => memberRefs[layout.slot[i].shape].current;

    // Members: lowered into position one after another
    while (c.member < s.members.length && plan.memberStart[c.member] + plan.spacing <= T) {
      const mesh = meshFor(c.member);
      if (mesh) {
        mesh.setMatrixAt(layout.slot[c.member].i, memberMatrix(s.members[c.member], tmp));
        touched.add(mesh);
      }
      const dm = detailRef.current;
      if (dm && details.start[c.member + 1] > details.start[c.member]) {
        for (let k = details.start[c.member]; k < details.start[c.member + 1]; k++) dm.setMatrixAt(k, details.mats[k]);
        touched.add(dm);
      }
      c.member++;
    }
    let target: THREE.Vector3 | null = null;
    let hangY = s.crane.height * 0.6;
    if (c.member < s.members.length && plan.memberStart[c.member] <= T) {
      const m = s.members[c.member];
      const p = (T - plan.memberStart[c.member]) / plan.spacing;
      const lift = DROP * (1 - easeOut(p));
      const mesh = meshFor(c.member);
      if (mesh) {
        mesh.setMatrixAt(layout.slot[c.member].i, memberMatrix(m, tmp, lift));
        touched.add(mesh);
      }
      target = new THREE.Vector3().fromArray(m.a).add(_b.fromArray(m.b)).multiplyScalar(0.5);
      hangY = Math.max(target.y, Math.max(m.a[1], m.b[1])) + lift + 0.04;
    }

    // Panels: decks and sheeting unroll once their supporting steel is up
    for (let j = c.panel; j < s.panels.length && plan.panelStart[j] <= T; j++) {
      const p = s.panels[j];
      const k = Math.min(1, (T - plan.panelStart[j]) / UNROLL_S);
      const mesh = panelRefs[p.kind].current;
      if (!mesh) continue;
      mesh.setMatrixAt(layout.pslot[j], panelMatrix(p, tmp, easeInOut(k)));
      touched.add(mesh);
      if (k >= 1 && j === c.panel) c.panel++;
    }

    // Fit-out and temporary works grow into place behind the steel
    for (let j = c.fixture; j < s.fixtures.length && plan.fixtureStart[j] <= T; j++) {
      const f = s.fixtures[j];
      const k = Math.min(1, (T - plan.fixtureStart[j]) / GROW_S);
      const mesh = (f.round ? fixCylRef : fixBoxRef).current;
      if (!mesh) continue;
      mesh.setMatrixAt(layout.fslot[j], fixtureMatrix(f, tmp, easeOut(k)));
      touched.add(mesh);
      if (k >= 1 && j === c.fixture) c.fixture++;
    }
    touched.forEach((m) => (m.instanceMatrix.needsUpdate = true));

    // Laydown stack is drawn down as members are lifted out
    const left = Math.ceil((1 - c.member / s.members.length) * stackRefs.current.length);
    stackRefs.current.forEach((bar, k) => bar && (bar.visible = k < left));
    // Concrete cores are slip-formed a little ahead of the steel
    const rise = Math.min(1, c.member / s.members.length + 0.2);
    staticRefs.current.forEach((m, k) => {
      if (!m) return;
      const b = s.statics[k];
      m.scale.y = rise;
      m.position.y = (b.size[1] * rise) / 2;
    });

    // Tower crane follows the lift with damped slewing and trolley travel
    const { x: cx, z: cz, height, reach } = s.crane;
    if (target) {
      const dx = target.x - cx, dz = target.z - cz;
      const want = Math.atan2(-dz, dx);
      let diff = want - c.angle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const kf = 1 - Math.exp(-dt * 5);
      c.angle += diff * kf;
      c.radius += (THREE.MathUtils.clamp(Math.hypot(dx, dz), 0.35, reach) - c.radius) * kf;
    }
    c.hookY += (hangY - c.hookY) * (1 - Math.exp(-dt * 8));
    if (slewRef.current) slewRef.current.rotation.y = c.angle;
    if (trolleyRef.current) trolleyRef.current.position.x = c.radius;
    if (hookRef.current) hookRef.current.position.set(c.radius, c.hookY - height, 0);
    if (cableRef.current) {
      const pos = cableRef.current.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, c.radius, -0.03, 0);
      pos.setXYZ(1, c.radius, c.hookY - height + 0.03, 0);
      pos.needsUpdate = true;
    }
  });

  const { x: cx, z: cz, height, reach } = s.crane;
  return (
    <group>
      {layout.count.i > 0 && <instancedMesh ref={iRef} args={[UNIT_I, mats.steel, layout.count.i]} castShadow receiveShadow frustumCulled={false} />}
      {layout.count.box > 0 && <instancedMesh ref={boxRef} args={[UNIT_BOX, mats.steel, layout.count.box]} castShadow receiveShadow frustumCulled={false} />}
      {layout.count.cyl > 0 && <instancedMesh ref={cylRef} args={[UNIT_CYL, mats.pipe, layout.count.cyl]} castShadow receiveShadow frustumCulled={false} />}
      {layout.fcount.box > 0 && <instancedMesh ref={fixBoxRef} args={[UNIT_BOX, mats.fixture, layout.fcount.box]} castShadow receiveShadow frustumCulled={false} />}
      {layout.fcount.cyl > 0 && <instancedMesh ref={fixCylRef} args={[UNIT_CYL, mats.fixture, layout.fcount.cyl]} castShadow receiveShadow frustumCulled={false} />}
      {details.mats.length > 0 && <instancedMesh ref={detailRef} args={[UNIT_BOX, mats.steel, details.mats.length]} castShadow frustumCulled={false} />}
      {s.statics.map((b, k) => (
        <mesh key={k} ref={(m) => void (staticRefs.current[k] = m)} position={b.pos} material={mats.static} castShadow receiveShadow>
          <boxGeometry args={b.size} />
        </mesh>
      ))}
      <SiteDressing s={s} mats={mats} stackRefs={stackRefs} />
      {PANEL_KINDS.map(
        (k) =>
          layout.pcount[k] > 0 && (
            <instancedMesh key={k} ref={panelRefs[k]} args={[UNIT_BOX, mats[k], layout.pcount[k]]} castShadow={k !== 'glass'} receiveShadow frustumCulled={false} />
          )
      )}

      {/* Tower crane */}
      <group position={[cx, 0, cz]}>
        <mesh position={[0, 0.03, 0]} material={CRANE_MATS.concrete} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.06, 0.32]} />
        </mesh>
        <Lattice segs={crane.mast} material={CRANE_MATS.yellow} />
        <group ref={slewRef} position={[0, height, 0]}>
          <mesh position={[0, 0.015, 0]} material={CRANE_MATS.dark} castShadow>
            <boxGeometry args={[0.16, 0.04, 0.16]} />
          </mesh>
          <Lattice segs={crane.slew} material={CRANE_MATS.yellow} />
          {/* Counterweight slabs on the counter-jib */}
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[-reach * 0.3 + k * 0.035, -0.05, 0]} material={CRANE_MATS.concrete} castShadow>
              <boxGeometry args={[0.03, 0.13, 0.13]} />
            </mesh>
          ))}
          {/* Operator cab */}
          <mesh position={[0.1, -0.035, 0.085]} material={CRANE_MATS.cab} castShadow>
            <boxGeometry args={[0.09, 0.075, 0.06]} />
          </mesh>
          <mesh position={[0.147, -0.035, 0.085]} material={CRANE_MATS.glass}>
            <boxGeometry args={[0.006, 0.055, 0.05]} />
          </mesh>
          <group ref={trolleyRef}>
            <mesh position={[0, -0.05, 0]} material={CRANE_MATS.dark}>
              <boxGeometry args={[0.07, 0.022, 0.085]} />
            </mesh>
          </group>
          <lineSegments>
            <bufferGeometry ref={cableRef}>
              <bufferAttribute attach="attributes-position" args={[new Float32Array(6), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color={COLOR.craneDark} />
          </lineSegments>
          <mesh ref={hookRef} material={CRANE_MATS.yellow}>
            <boxGeometry args={[0.04, 0.045, 0.03]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const CRANE_MATS = {
  yellow: new THREE.MeshStandardMaterial({ color: COLOR.crane, roughness: 0.55, metalness: 0.2 }),
  dark: new THREE.MeshStandardMaterial({ color: COLOR.craneDark, roughness: 0.5 }),
  concrete: new THREE.MeshStandardMaterial({ color: COLOR.counterweight, roughness: 0.95 }),
  cab: new THREE.MeshStandardMaterial({ color: '#F1F3F5', roughness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ color: '#3E5878', roughness: 0.2, metalness: 0.3 })
};

const makeSiteMaterials = (): SiteMaterials => ({
  steel: new THREE.MeshStandardMaterial({ color: COLOR.steel, metalness: 0.45, roughness: 0.5 }),
  pipe: new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.4, roughness: 0.45 }),
  static: new THREE.MeshStandardMaterial({ color: '#B9BDC3', roughness: 0.95 }),
  fixture: new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.2, roughness: 0.6 }),
  deck: new THREE.MeshStandardMaterial({ color: COLOR.deck, roughness: 0.85 }),
  roof: new THREE.MeshStandardMaterial({ map: siteTextures().roof, metalness: 0.25, roughness: 0.55 }),
  wall: new THREE.MeshStandardMaterial({ map: siteTextures().wall, roughness: 0.7 }),
  glass: new THREE.MeshStandardMaterial({ map: siteTextures().glass, metalness: 0.3, roughness: 0.15, transparent: true, opacity: GLASS_OPACITY }),
  belt: new THREE.MeshStandardMaterial({ color: '#2A2E35', roughness: 0.9 })
});

const TRUCK_MATS = {
  cab: new THREE.MeshStandardMaterial({ color: '#E9ECEF', roughness: 0.45 }),
  stripe: new THREE.MeshStandardMaterial({ color: '#1270F9', roughness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ color: '#2E3B4E', roughness: 0.2, metalness: 0.3 }),
  chassis: new THREE.MeshStandardMaterial({ color: '#2B2F36', roughness: 0.7 }),
  bed: new THREE.MeshStandardMaterial({ color: '#6B6157', roughness: 0.9 }),
  tyre: new THREE.MeshStandardMaterial({ color: '#1C1F24', roughness: 0.95 }),
  timber: new THREE.MeshStandardMaterial({ color: '#9C7A52', roughness: 0.95 }),
  window: new THREE.MeshStandardMaterial({ color: '#3D5573', roughness: 0.25, metalness: 0.2 })
};

const DRESS_MATS = {
  skip: new THREE.MeshStandardMaterial({ color: '#E2A60F', roughness: 0.7 }),
  rubble: new THREE.MeshStandardMaterial({ color: '#8A8075', roughness: 1 }),
  toilet: new THREE.MeshStandardMaterial({ color: '#2F7FC1', roughness: 0.6 }),
  roof: new THREE.MeshStandardMaterial({ color: '#E9ECEF', roughness: 0.6 }),
  mast: new THREE.MeshStandardMaterial({ color: '#C2C7CE', roughness: 0.5, metalness: 0.3 }),
  lamp: new THREE.MeshBasicMaterial({ color: '#FFF6D8' }),
  asphalt: new THREE.MeshStandardMaterial({ color: '#9EA4AC', roughness: 1 }),
  trunk: new THREE.MeshStandardMaterial({ color: '#7A5E44', roughness: 1 }),
  leaf: new THREE.MeshStandardMaterial({ color: '#6E8B4E', roughness: 0.95, flatShading: true }),
  leafDark: new THREE.MeshStandardMaterial({ color: '#56723D', roughness: 0.95, flatShading: true })
};

const Tree: React.FC<{ position: V3; size?: number; dark?: boolean }> = ({ position, size = 1, dark }) => (
  <group position={position} scale={size}>
    <mesh position={[0, 0.06, 0]} material={DRESS_MATS.trunk} castShadow>
      <cylinderGeometry args={[0.012, 0.016, 0.12, 6]} />
    </mesh>
    <mesh position={[0, 0.17, 0]} material={dark ? DRESS_MATS.leafDark : DRESS_MATS.leaf} castShadow>
      <icosahedronGeometry args={[0.09, 0]} />
    </mesh>
    <mesh position={[0.04, 0.13, 0.03]} material={dark ? DRESS_MATS.leaf : DRESS_MATS.leafDark} castShadow>
      <icosahedronGeometry args={[0.06, 0]} />
    </mesh>
  </group>
);

// Rigid flatbed delivering a load of steel, parked facing +x
const Truck: React.FC<{ position: V3; steel: THREE.Material }> = ({ position, steel }) => (
  <group position={position}>
    <mesh position={[0, 0.07, 0]} material={TRUCK_MATS.chassis} castShadow>
      <boxGeometry args={[0.9, 0.04, 0.2]} />
    </mesh>
    <mesh position={[0.34, 0.2, 0]} material={TRUCK_MATS.cab} castShadow>
      <boxGeometry args={[0.2, 0.24, 0.27]} />
    </mesh>
    <mesh position={[0.34, 0.12, 0]} material={TRUCK_MATS.stripe}>
      <boxGeometry args={[0.202, 0.03, 0.272]} />
    </mesh>
    <mesh position={[0.442, 0.24, 0]} material={TRUCK_MATS.glass}>
      <boxGeometry args={[0.006, 0.1, 0.23]} />
    </mesh>
    <mesh position={[-0.12, 0.105, 0]} material={TRUCK_MATS.bed} castShadow receiveShadow>
      <boxGeometry args={[0.64, 0.03, 0.28]} />
    </mesh>
    {[-0.07, 0, 0.07].map((z, k) => (
      <mesh key={z} geometry={UNIT_I} material={steel} position={[-0.12, 0.145 + (k === 1 ? 0.045 : 0), z * (k === 1 ? 0 : 1)]} rotation-y={Math.PI / 2} scale={[0.05, 0.05, 0.6]} castShadow />
    ))}
    {[0.34, -0.2, -0.33].flatMap((x) =>
      [-0.12, 0.12].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.05, z]} rotation-x={Math.PI / 2} material={TRUCK_MATS.tyre}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        </mesh>
      ))
    )}
  </group>
);

// Perimeter hoarding, site cabins, a delivery truck and the steel laydown stack that the crane draws from
const SiteDressing: React.FC<{ s: Structure; mats: SiteMaterials; stackRefs: React.RefObject<(THREE.Mesh | null)[]> }> = ({ s, mats, stackRefs }) => {
  const hx = s.half[0] + SLAB.side, back = -s.half[1] - SLAB.back, front = s.half[1] + SLAB.front;
  const fenceH = 0.12;
  const stackX = hx - 0.35;
  const truckX = (0.2 + stackX - 0.3) / 2;
  return (
    <group>
      <mesh position={[0, fenceH / 2, back]} material={mats.wall} castShadow>
        <boxGeometry args={[hx * 2, fenceH, 0.015]} />
      </mesh>
      <mesh position={[-hx, fenceH / 2, (back + front) / 2]} material={mats.wall} castShadow>
        <boxGeometry args={[0.015, fenceH, front - back]} />
      </mesh>
      {/* Stacked site cabins with window bands */}
      {[0, 1].map((k) => (
        <group key={k} position={[-hx + 0.3, 0.075 + k * 0.15, back + 0.14 + k * 0.03]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.15, 0.17]} />
            <meshStandardMaterial color={k ? '#E8EBEF' : '#5D7FA8'} roughness={0.7} />
          </mesh>
          {[-0.12, 0, 0.12].map((x) => (
            <mesh key={x} position={[x, 0.01, 0.0855]} material={TRUCK_MATS.window}>
              <boxGeometry args={[0.07, 0.05, 0.002]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Steel laydown: I-section bundles on timber dunnage */}
      {[-0.2, 0.2].map((dx) => (
        <mesh key={dx} position={[stackX + dx, 0.008, back + 0.195]} material={TRUCK_MATS.timber} castShadow>
          <boxGeometry args={[0.04, 0.016, 0.26]} />
        </mesh>
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <mesh
          key={k}
          ref={(m) => void (stackRefs.current[k] = m)}
          geometry={UNIT_I}
          position={[stackX, 0.04 + Math.floor(k / 3) * 0.05, back + 0.12 + (k % 3) * 0.075]}
          rotation-y={Math.PI / 2}
          scale={[0.05, 0.045, 0.55]}
          material={mats.steel}
          castShadow
        />
      ))}
      {truckX - 0.45 > 0.2 && (
        <>
          <mesh position={[truckX, 0.002, back + 0.32]} material={DRESS_MATS.asphalt} receiveShadow>
            <boxGeometry args={[1.15, 0.004, 0.36]} />
          </mesh>
          <Truck position={[truckX, 0, back + 0.32]} steel={mats.steel} />
        </>
      )}
      {/* Welfare: portable toilets beside the cabins */}
      {[0, 1].map((k) => (
        <group key={k} position={[-hx + 0.58 + k * 0.085, 0, back + 0.1]}>
          <mesh position={[0, 0.07, 0]} material={DRESS_MATS.toilet} castShadow>
            <boxGeometry args={[0.07, 0.14, 0.07]} />
          </mesh>
          <mesh position={[0, 0.145, 0]} material={DRESS_MATS.roof}>
            <boxGeometry args={[0.075, 0.01, 0.075]} />
          </mesh>
        </group>
      ))}
      {/* Waste skip at the front corner */}
      <group position={[-hx + 0.2, 0, front - 0.12]}>
        <mesh position={[0, 0.05, 0]} material={DRESS_MATS.skip} castShadow>
          <boxGeometry args={[0.26, 0.1, 0.15]} />
        </mesh>
        <mesh position={[0, 0.1, 0]} material={DRESS_MATS.rubble}>
          <boxGeometry args={[0.23, 0.012, 0.12]} />
        </mesh>
      </group>
      {/* Lighting tower on its trailer */}
      <group position={[-hx + 0.1, 0, (back + front) / 2 + 0.2]}>
        <mesh position={[0, 0.03, 0]} material={DRESS_MATS.mast} castShadow>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
        </mesh>
        <mesh position={[0, 0.3, 0]} material={DRESS_MATS.mast} castShadow>
          <boxGeometry args={[0.014, 0.5, 0.014]} />
        </mesh>
        <mesh position={[0.012, 0.56, 0]} material={TRUCK_MATS.chassis} castShadow>
          <boxGeometry args={[0.02, 0.05, 0.13]} />
        </mesh>
        {[-0.04, 0, 0.04].map((z) => (
          <mesh key={z} position={[0.023, 0.56, z]} material={DRESS_MATS.lamp}>
            <boxGeometry args={[0.004, 0.035, 0.03]} />
          </mesh>
        ))}
      </group>
      {/* Street trees just outside the hoarding */}
      <Tree position={[hx + 0.15, 0, front - 0.1]} />
      <Tree position={[hx + 0.18, 0, front - 0.5]} size={0.8} dark />
      <Tree position={[-hx - 0.16, 0, back + 0.3]} size={0.9} />
      <Tree position={[-hx - 0.14, 0, front - 0.2]} size={0.75} dark />
    </group>
  );
};

// Low-rise blocks clustered round each city pin, densest and tallest at the centre
const CITY_MAT = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 });
const CITY_TONES = ['#F4F5F7', '#E3E6EA', '#D3D8DE', '#C4CAD2', '#FBE3CF'];
const CityBlocks: React.FC<{ at: THREE.Vector3; seed: number }> = ({ at, seed }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 46;
  const [rings, setRings] = useState<Ring[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadLandRings()
      .then((r) => alive && setRings(r))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh || !rings) return;
    let st = seed * 9973 + 17;
    const r = () => ((st = (st * 16807) % 2147483647) - 1) / 2147483646;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(UP, SITE_ROTATION), col = new THREE.Color();
    for (let k = 0, tries = 0; k < count; k++) {
      const ang = r() * Math.PI * 2, rad = 0.09 + Math.pow(r(), 1.4) * 0.2;
      const x = at.x + Math.cos(ang) * rad, z = at.z + Math.sin(ang) * rad * 0.8;
      // Only build on land; give up on a plot after enough misses (small islands)
      if (!ashore(rings, x / K, -z / K)) {
        mesh.setMatrixAt(k, HIDDEN);
        if (++tries < 400) k--;
        continue;
      }
      const h = (0.02 + r() * 0.05) * (1.5 - rad * 2.5) + (r() < 0.08 ? 0.07 : 0);
      const w = 0.02 + r() * 0.025, d = 0.02 + r() * 0.025;
      m.compose(_c.set(x, at.y + h / 2, z), q, _u.set(w, h, d));
      mesh.setMatrixAt(k, m);
      mesh.setColorAt(k, col.set(CITY_TONES[Math.floor(r() * CITY_TONES.length)]));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [at, seed, rings]);
  return <instancedMesh ref={ref} args={[UNIT_BOX, CITY_MAT, count]} visible={!!rings} castShadow receiveShadow />;
};

type SiteProps = {
  index: number;
  def: SiteDef;
  reduced: boolean;
  onIssue: (index: number, s: Structure) => void;
  anchors: React.RefObject<THREE.Vector3[]>;
};

const Site: React.FC<SiteProps> = ({ index, def, reduced, onIssue, anchors }) => {
  const [s, setS] = useState(() => generateStructure());
  const plan = useMemo(() => planTimeline(s), [s]);
  const mats = useMemo(() => makeSiteMaterials(), []);
  const time = useRef(0);
  const phase = useRef({ issuedAt: -1, fresh: true });
  const pos = useMemo(() => toWorld(def.at[0], def.at[1], LAND_H), [def]);
  const pin = useMemo(() => toWorld(def.lon, def.lat, LAND_H + 0.004), [def]);
  const city = useMemo(() => toWorld(def.lon, def.lat, LAND_H), [def]);
  // Label sits just in front of the slab's nearest corner, whatever the footprint.
  const labelOffset = useMemo(() => {
    const hx = s.half[0] + SLAB.side, back = -s.half[1] - SLAB.back, front = s.half[1] + SLAB.front;
    const c = Math.cos(SITE_ROTATION), sn = Math.sin(SITE_ROTATION);
    return Math.max(...[[hx, front], [hx, back], [-hx, front], [-hx, back]].map(([x, z]) => -x * sn + z * c)) * s.scale + 0.3;
  }, [s]);
  useLayoutEffect(() => {
    anchors.current[index] = new THREE.Vector3(pos.x, 0, pos.z + labelOffset);
  }, [anchors, index, pos, labelOffset]);

  useLayoutEffect(() => {
    // First structure starts part-way through so the map opens with work in progress.
    time.current = reduced ? plan.total : phase.current.fresh ? plan.total * (0.15 + Math.random() * 0.6) : 0;
    phase.current = { issuedAt: reduced ? Infinity : -1, fresh: false };
    Object.values(mats).forEach((m) => {
      m.opacity = m === mats.glass ? GLASS_OPACITY : 1;
      m.transparent = m === mats.glass;
      m.needsUpdate = true;
    });
    mats.steel.color.set(COLOR.steel);
  }, [plan, reduced, mats]);

  useFrame((_, dt) => {
    if (reduced) return;
    time.current += Math.min(dt, 0.1);
    const ph = phase.current;
    if (ph.issuedAt < 0 && time.current >= plan.total) {
      ph.issuedAt = time.current;
      onIssue(index, s);
    }
    if (ph.issuedAt >= 0) {
      const since = time.current - ph.issuedAt;
      // Approved steel briefly reads green, then the site clears for the next job.
      mats.steel.color.lerpColors(STEEL, STEEL_ISSUED, Math.min(1, since / 0.8));
      if (since > HOLD_S) {
        const f = Math.min(1, (since - HOLD_S) / FADE_S);
        Object.values(mats).forEach((m) => {
          if (!m.transparent) {
            m.transparent = true;
            m.needsUpdate = true;
          }
          m.opacity = (m === mats.glass ? GLASS_OPACITY : 1) * (1 - f);
        });
        if (f >= 1) setS(generateStructure(s.type));
      }
    }
  });

  return (
    <group>
      <Line points={[pin, new THREE.Vector3(pos.x, LAND_H + 0.004, pos.z)]} color={COLOR.ink} lineWidth={2} transparent opacity={0.7} />
      <mesh position={pin} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
        <meshStandardMaterial color={COLOR.ink} />
      </mesh>
      <mesh position={[pin.x, pin.y + 0.02, pin.z]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <CityBlocks at={city} seed={index + 1} />

      <group position={pos} rotation-y={SITE_ROTATION} scale={s.scale}>
        {/* Compacted earth apron around the site, with a concrete hardstanding where the building goes */}
        <mesh position={[0, -0.02, (SLAB.front - SLAB.back) / 2]} receiveShadow castShadow>
          <boxGeometry args={[s.half[0] * 2 + SLAB.side * 2 + 0.3, 0.04, s.half[1] * 2 + SLAB.back + SLAB.front + 0.3]} />
          <meshStandardMaterial color={COLOR.earth} roughness={1} />
        </mesh>
        <mesh position={[0, -0.01, (SLAB.front - SLAB.back) / 2]} receiveShadow castShadow>
          <boxGeometry args={[s.half[0] * 2 + SLAB.side * 2, 0.06, s.half[1] * 2 + SLAB.back + SLAB.front]} />
          <meshStandardMaterial color={COLOR.slab} roughness={0.95} />
        </mesh>
        <Erection key={s.id} s={s} plan={plan} time={time} mats={mats} />
      </group>

    </group>
  );
};

/* ------------------------------------------------------------------
   Head office
------------------------------------------------------------------- */

const HQ_POS = toWorld(HQ_DEF.lon, HQ_DEF.lat, LAND_H);
const TOWER = { w: 0.95, d: 0.95, h: 2.2, x: -0.25, z: -0.15, base: 0.5 };
const HQ_ROOF = new THREE.Vector3(HQ_POS.x + TOWER.x, LAND_H + TOWER.base + TOWER.h + 0.12, HQ_POS.z + TOWER.z);

// Curtain-wall glazing: one pane per bay and floor, a few lit or blind-drawn, with a sky reflection over the top
const facadeTexture = (cols: number, rows: number) =>
  canvasTexture(256, 256, (g) => {
    let st = 11;
    const r = () => ((st = (st * 16807) % 2147483647) - 1) / 2147483646;
    const pw = 256 / cols, ph = 256 / rows;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const t = r();
        g.fillStyle = t < 0.12 ? '#C9D8E8' : t < 0.22 ? '#5A7598' : `hsl(212, 32%, ${44 + r() * 12}%)`;
        g.fillRect(i * pw, j * ph, pw, ph);
        g.fillStyle = 'rgba(30,42,60,0.35)';
        g.fillRect(i * pw, j * ph + ph * 0.78, pw, ph * 0.22);
        g.fillStyle = 'rgba(238,242,246,0.8)';
        g.fillRect(i * pw + pw / 2 - 0.6, j * ph, 1.2, ph * 0.78);
      }
    const sky = g.createLinearGradient(0, 0, 256, 256);
    sky.addColorStop(0, 'rgba(255,255,255,0.28)');
    sky.addColorStop(0.5, 'rgba(255,255,255,0)');
    sky.addColorStop(1, 'rgba(255,255,255,0.12)');
    g.fillStyle = sky;
    g.fillRect(0, 0, 256, 256);
  });

const HQ_MATS = (() => {
  let m: Record<'tower' | 'podium' | 'mullion' | 'plant' | 'fan' | 'green' | 'paving' | 'asphalt', THREE.MeshStandardMaterial> | null = null;
  return () =>
    (m ??= {
      tower: new THREE.MeshStandardMaterial({ map: facadeTexture(7, 11), metalness: 0.35, roughness: 0.18 }),
      podium: new THREE.MeshStandardMaterial({ map: facadeTexture(14, 2), metalness: 0.35, roughness: 0.2 }),
      mullion: new THREE.MeshStandardMaterial({ color: COLOR.mullion }),
      plant: new THREE.MeshStandardMaterial({ color: '#C4CAD3', roughness: 0.6 }),
      fan: new THREE.MeshStandardMaterial({ color: '#4A525D', roughness: 0.6 }),
      green: new THREE.MeshStandardMaterial({ color: '#8DAA62', roughness: 1 }),
      paving: new THREE.MeshStandardMaterial({ color: '#D9DCE0', roughness: 0.95 }),
      asphalt: new THREE.MeshStandardMaterial({ color: '#6B7078', roughness: 1 })
    });
})();
const BAY_PAINT = new THREE.MeshBasicMaterial({ color: '#F2F3F5' });
const CAR_COLORS = ['#E9ECEF', '#2B2F36', '#9AA1AA', '#B5473A', '#1270F9', '#E9ECEF', '#5D6B7A', '#C9CED6'];

const HeadOffice: React.FC = () => {
  const floors = 11;
  const fh = TOWER.h / floors;
  const fins = 7;
  const mats = HQ_MATS();
  const podTop = 0.05 + TOWER.base;
  return (
    <group position={HQ_POS} rotation-y={SITE_ROTATION}>
      <mesh position={[0.3, 0.025, 0.05]} material={mats.paving} receiveShadow>
        <boxGeometry args={[3.3, 0.05, 2.3]} />
      </mesh>
      {/* Lawns either side of the entrance plaza */}
      {[-0.75, 0.75].map((x) => (
        <mesh key={x} position={[x + 0.1, 0.052, 1.03]} material={mats.green} receiveShadow>
          <boxGeometry args={[0.95, 0.006, 0.22]} />
        </mesh>
      ))}
      {/* Podium */}
      <mesh position={[0.1, 0.05 + TOWER.base / 2, 0.1]} material={mats.podium} castShadow receiveShadow>
        <boxGeometry args={[2.1, TOWER.base, 1.6]} />
      </mesh>
      {[0.05, 0.05 + TOWER.base / 2, podTop].map((y) => (
        <mesh key={y} position={[0.1, y, 0.1]} material={mats.mullion} castShadow>
          <boxGeometry args={[2.16, 0.035, 1.66]} />
        </mesh>
      ))}
      {/* Entrance canopy on slender columns */}
      <mesh position={[0.1, 0.26, 1.02]} material={mats.mullion} castShadow>
        <boxGeometry args={[0.6, 0.025, 0.24]} />
      </mesh>
      {[-0.17, 0.37].map((x) => (
        <mesh key={x} position={[x, 0.15, 1.11]} material={mats.mullion} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        </mesh>
      ))}
      {/* Green roof and terrace planting on the podium */}
      <mesh position={[0.72, podTop + 0.022, 0.1]} material={mats.green} receiveShadow>
        <boxGeometry args={[0.78, 0.012, 1.4]} />
      </mesh>
      {[[0.55, -0.4], [0.9, 0.05], [0.6, 0.55], [0.95, 0.65]].map(([x, z]) => (
        <Tree key={`${x}${z}`} position={[x, podTop + 0.02, z]} size={0.9} dark={x > 0.8} />
      ))}
      {/* Tower */}
      <group position={[TOWER.x, podTop, TOWER.z]}>
        <mesh position={[0, TOWER.h / 2, 0]} material={mats.tower} castShadow receiveShadow>
          <boxGeometry args={[TOWER.w, TOWER.h, TOWER.d]} />
        </mesh>
        {Array.from({ length: floors + 1 }, (_, f) => (
          <mesh key={f} position={[0, f * fh, 0]} material={mats.mullion}>
            <boxGeometry args={[TOWER.w + 0.03, 0.022, TOWER.d + 0.03]} />
          </mesh>
        ))}
        {Array.from({ length: fins }, (_, i) => {
          const o = -TOWER.w / 2 + (TOWER.w * (i + 0.5)) / fins;
          return (
            <group key={i}>
              <mesh position={[o, TOWER.h / 2, TOWER.d / 2 + 0.012]} material={mats.mullion}>
                <boxGeometry args={[0.018, TOWER.h, 0.03]} />
              </mesh>
              <mesh position={[TOWER.w / 2 + 0.012, TOWER.h / 2, o]} material={mats.mullion}>
                <boxGeometry args={[0.03, TOWER.h, 0.018]} />
              </mesh>
            </group>
          );
        })}
        {/* Crown in the logo colours */}
        {['#28A44A', '#F47106', '#1270F9'].map((c, i) => (
          <mesh key={c} position={[0, TOWER.h + 0.03 + i * 0.035, 0]}>
            <boxGeometry args={[TOWER.w + 0.03, 0.035, TOWER.d + 0.03]} />
            <meshStandardMaterial color={c} />
          </mesh>
        ))}
        <mesh position={[0, TOWER.h + 0.125, 0]}>
          <boxGeometry args={[TOWER.w + 0.035, 0.012, TOWER.d + 0.035]} />
          <meshStandardMaterial color="#EEF1F5" />
        </mesh>
        {/* Roof plant: lift overrun, cooling towers and a communications mast */}
        <mesh position={[0.15, TOWER.h + 0.17, -0.1]} material={mats.plant} castShadow>
          <boxGeometry args={[0.4, 0.12, 0.35]} />
        </mesh>
        {[-0.22, 0.02].map((x) => (
          <group key={x} position={[x, TOWER.h + 0.13, 0.26]}>
            <mesh position={[0, 0.045, 0]} material={mats.plant} castShadow>
              <boxGeometry args={[0.18, 0.09, 0.18]} />
            </mesh>
            <mesh position={[0, 0.095, 0]} material={mats.fan}>
              <cylinderGeometry args={[0.07, 0.07, 0.012, 16]} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.3, TOWER.h + 0.33, -0.28]} material={mats.plant} castShadow>
          <cylinderGeometry args={[0.008, 0.012, 0.4, 6]} />
        </mesh>
      </group>
      {/* Staff car park with marked bays */}
      <mesh position={[1.55, 0.052, 0.05]} material={mats.asphalt} receiveShadow>
        <boxGeometry args={[0.7, 0.006, 2.0]} />
      </mesh>
      {Array.from({ length: 11 }, (_, k) => (
        <group key={k}>
          {[1.33, 1.77].map((x) => (
            <mesh key={x} position={[x, 0.056, -0.85 + k * 0.17]} material={BAY_PAINT}>
              <boxGeometry args={[0.2, 0.002, 0.008]} />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({ length: 20 }, (_, k) => {
        const side = k % 2, slot = Math.floor(k / 2);
        if ((k * 7) % 5 === 0) return null;
        return (
          <group key={k} position={[side ? 1.76 : 1.34, 0.055, -0.765 + slot * 0.17]}>
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.16, 0.04, 0.085]} />
              <meshStandardMaterial color={CAR_COLORS[k % CAR_COLORS.length]} roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[side ? 0.012 : -0.012, 0.05, 0]} material={TRUCK_MATS.glass}>
              <boxGeometry args={[0.085, 0.022, 0.075]} />
            </mesh>
          </group>
        );
      })}
      {/* Trees along the plaza edge and the car park */}
      {[-1.15, -0.85, 0.95, 1.95].map((x, k) => (
        <Tree key={x} position={[x, 0.05, 1.03]} size={1.15} dark={k % 2 === 1} />
      ))}
      {[-0.75, -0.35, 0.05, 0.45, 0.85].map((z, k) => (
        <Tree key={z} position={[1.98, 0.05, z]} size={1.1} dark={k % 2 === 0} />
      ))}
      {[-0.6, 0, 0.6].map((z) => (
        <Tree key={z} position={[-1.15, 0.05, z]} size={1.2} />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------
   Routes and issued packages
------------------------------------------------------------------- */

const SPLIT = new THREE.Vector3(HQ_ROOF.x, HQ_ROOF.y + 0.9, HQ_ROOF.z);

const routeCurves = (sites: SiteDef[]) =>
  sites.map((s) => {
    const end = toWorld(s.lon, s.lat, LAND_H + 0.01);
    const mid = new THREE.Vector3().addVectors(SPLIT, end).multiplyScalar(0.5);
    mid.y = SPLIT.y + SPLIT.distanceTo(end) * 0.14;
    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(HQ_ROOF.clone(), SPLIT.clone()));
    path.add(new THREE.QuadraticBezierCurve3(SPLIT.clone(), mid, end));
    return { branch: new THREE.QuadraticBezierCurve3(SPLIT.clone(), mid, end), path, end };
  });

type Packet = { site: number; start: number };
const POOL = 6;
const TRAIL = 14;

const Routes: React.FC<{ sites: SiteDef[]; packets: React.RefObject<Packet[]> }> = ({ sites, packets }) => {
  const curves = useMemo(() => routeCurves(sites), [sites]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const trails = useRef<(THREE.BufferGeometry | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const live = packets.current.filter((p) => now - p.start < PACKET_S + 1.4);
    packets.current = live;
    for (let k = 0; k < POOL; k++) {
      const p = live[k];
      const dot = dots.current[k], trail = trails.current[k], ring = rings.current[k];
      if (!dot || !trail || !ring) continue;
      if (!p) {
        dot.visible = false;
        ring.visible = false;
        trail.setDrawRange(0, 0);
        continue;
      }
      const raw = (now - p.start) / PACKET_S;
      const curve = curves[p.site].path;
      const t = easeInOut(Math.min(1, raw));
      dot.visible = raw < 1;
      dot.position.copy(curve.getPointAt(t));
      const pos = trail.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < TRAIL; i++) {
        const tt = Math.max(0, t - 0.07 * (1 - i / (TRAIL - 1)));
        const v = curve.getPointAt(tt);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      trail.setDrawRange(0, raw < 1 ? TRAIL : 0);
      // Arrival ring at the project pin
      const r = (now - p.start - PACKET_S) / 1.4;
      ring.visible = r > 0 && r < 1;
      if (ring.visible) {
        ring.position.copy(curves[p.site].end);
        ring.scale.setScalar(0.1 + easeOut(r) * 0.5);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - r);
      }
    }
  });

  return (
    <group>
      <Line points={[HQ_ROOF, SPLIT]} color={COLOR.ink} lineWidth={3.2} transparent opacity={0.75} />
      {curves.map((c, i) => (
        <Line key={i} points={c.branch.getPoints(64)} color={COLOR.ink} lineWidth={2.4} transparent opacity={0.55} />
      ))}
      <mesh position={SPLIT}>
        <sphereGeometry args={[0.06, 16, 12]} />
        <meshBasicMaterial color={COLOR.ink} />
      </mesh>
      {Array.from({ length: POOL }, (_, k) => (
        <group key={k}>
          <mesh ref={(m) => void (dots.current[k] = m)} visible={false}>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshBasicMaterial color={COLOR.accent} />
          </mesh>
          <line>
            <bufferGeometry ref={(g) => void (trails.current[k] = g as THREE.BufferGeometry | null)}>
              <bufferAttribute attach="attributes-position" args={[new Float32Array(TRAIL * 3), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color={COLOR.accent} />
          </line>
          <mesh ref={(m) => void (rings.current[k] = m)} rotation-x={-Math.PI / 2} visible={false}>
            <ringGeometry args={[0.8, 1, 48]} />
            <meshBasicMaterial color={COLOR.accent} transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------
   Camera and scene
------------------------------------------------------------------- */

const CameraRig: React.FC = () => {
  const { camera, size } = useThree();
  const born = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (born.current === null) born.current = clock.elapsedTime;
    const e = easeOut(Math.min(1, (clock.elapsedTime - born.current) / 2.6));
    const fit = Math.min(size.width / VIEW.w, size.height / VIEW.h);
    camera.zoom = fit * (0.95 + 0.05 * e);
    camera.position.copy(TARGET).addScaledVector(CAM_DIR, 60);
    camera.position.x += (1 - e) * 1.2;
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
  });
  return null;
};

type SceneProps = {
  sites: SiteDef[];
  active: boolean;
  onIssue: (index: number, s: Structure) => void;
  // HTML labels laid over the canvas: one per site, then the head office.
  labels: React.RefObject<(HTMLElement | null)[]>;
};

// Projects label anchors to screen space each frame and moves the overlay elements to match.
const LabelProjector: React.FC<{ anchors: React.RefObject<THREE.Vector3[]>; labels: SceneProps['labels'] }> = ({ anchors, labels }) => {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    anchors.current.forEach((a, i) => {
      const el = labels.current[i];
      if (!a || !el) return;
      v.copy(a).project(camera);
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0) translate(-50%, -50%)`;
      el.style.opacity = '1';
    });
  });
  return null;
};

const SceneContents: React.FC<SceneProps & { reduced: boolean }> = ({ sites, reduced, onIssue, labels }) => {
  const packets = useRef<Packet[]>([]);
  const anchors = useRef<THREE.Vector3[]>([]);
  useLayoutEffect(() => {
    anchors.current[sites.length] = new THREE.Vector3(HQ_POS.x - 0.45, 0, HQ_POS.z + 1.5);
  }, [sites.length]);
  const clock = useThree((st) => st.clock);
  const handleIssue = useMemo(
    () => (index: number, s: Structure) => {
      packets.current = [...packets.current, { site: index, start: clock.elapsedTime }];
      onIssue(index, s);
    },
    [clock, onIssue]
  );
  const light = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    if (!light.current) return;
    light.current.target.position.copy(TARGET);
    light.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <CameraRig />
      <LabelProjector anchors={anchors} labels={labels} />
      <Reflections />
      <hemisphereLight args={['#ffffff', '#d8dde5', 1.9]} />
      <directionalLight
        ref={light}
        position={TARGET.clone().addScaledVector(LIGHT_DIR, 30).toArray()}
        intensity={1.25}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={70}
      />
      <World />
      <Routes sites={sites} packets={packets} />
      <HeadOffice />
      {sites.map((def, i) => (
        <Site key={def.city} index={i} def={def} reduced={reduced} onIssue={handleIssue} anchors={anchors} />
      ))}
    </>
  );
};

const WorldScene: React.FC<SceneProps> = (props) => {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  return (
    <Canvas
      orthographic
      shadows
      flat
      dpr={[1, 2]}
      frameloop={props.active && !reduced ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: TARGET.clone().addScaledVector(CAM_DIR, 60).toArray(), zoom: 40, near: 1, far: 200 }}
    >
      <SceneContents {...props} reduced={reduced} />
    </Canvas>
  );
};

export default memo(WorldScene);
