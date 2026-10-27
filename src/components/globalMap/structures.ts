// Procedural steel structures for the global delivery map.
// Units: 1 = one structural bay (~7.5 m). y is up. Members are listed in erection order.

export type V3 = [number, number, number];
export type MemberKind = 'col' | 'girder' | 'beam' | 'brace' | 'rod' | 'purlin' | 'truss' | 'pipe' | 'plate';
export type PanelKind = 'deck' | 'roof' | 'wall' | 'glass' | 'belt';

export type Member = { a: V3; b: V3; kind: MemberKind; size?: number; color?: string };
// A flat sheet spanning corner o along edge vectors u and v, fitted once `after` members are erected.
export type Panel = { o: V3; u: V3; v: V3; kind: PanelKind; after: number };
// Fixed site elements that are in place before steel erection starts (e.g. a cast concrete core).
export type StaticBox = { pos: V3; size: V3; color: string };
// Fit-out and temporary works (rails, hoists, plant, doors, racking) fitted once `after` members are erected:
// a box, or a cylinder when round, stretched from a to b with cross-section w × d. It grows out from a.
export type Fixture = { a: V3; b: V3; w: number; d: number; color: string; round?: boolean; after: number };

export type Structure = {
  id: number;
  type: string;
  job: string;
  members: Member[];
  panels: Panel[];
  statics: StaticBox[];
  fixtures: Fixture[];
  height: number;
  half: [number, number];
  // Uniform scale that brings the structure to map size.
  scale: number;
  crane: { x: number; z: number; height: number; reach: number };
  tons: number;
  duration: number;
};

// Cross-section [width, depth] in bay units; rods and pipes are round, I_SECTION kinds are wide-flange shapes.
export const PROFILE: Record<MemberKind, [number, number]> = {
  col: [0.075, 0.075],
  girder: [0.045, 0.09],
  beam: [0.034, 0.06],
  brace: [0.034, 0.034],
  rod: [0.014, 0.014],
  purlin: [0.024, 0.048],
  truss: [0.032, 0.032],
  pipe: [0.08, 0.08],
  plate: [0.17, 0.17]
};
export const ROUND: Partial<Record<MemberKind, true>> = { rod: true, pipe: true };
export const I_SECTION: Partial<Record<MemberKind, true>> = { col: true, girder: true, beam: true, purlin: true };
const LB_PER_FT: Record<MemberKind, number> = { col: 68, girder: 50, beam: 26, brace: 22, rod: 3, purlin: 6, truss: 15, pipe: 28, plate: 120 };
const PIPE_COLORS = ['#8E98A6', '#8E98A6', '#D8D2C4', '#B5473A', '#6E7D5A', '#C9A227'];

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
type Rng = () => number;
const int = (r: Rng, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const range = (r: Rng, a: number, b: number) => a + r() * (b - a);

// Finish colours for fit-out and temporary works
const FIT = {
  safety: '#E2A60F',
  galv: '#A9B1BB',
  plant: '#CDD2D9',
  plantDark: '#7C8590',
  fan: '#4A525D',
  hoist: '#C2C7CE',
  shutter: '#8F98A3',
  door: '#3F5E86',
  concrete: '#C4C8CE',
  rubber: '#23262B',
  upright: '#2E5AAC',
  rackBeam: '#E87722',
  carton: '#C9A57A',
  wrap: '#E7E2D6',
  motor: '#2F6B9A',
  machine: '#4A5361',
  valve: '#3D6FB0'
};

type Out = { members: Member[]; panels: Panel[]; statics: StaticBox[]; fixtures: Fixture[] };
const add = (o: Out, a: V3, b: V3, kind: MemberKind, size?: number, color?: string) => o.members.push({ a, b, kind, size, color });
const sheet = (o: Out, origin: V3, u: V3, v: V3, kind: PanelKind) => o.panels.push({ o: origin, u, v, kind, after: o.members.length });
const bar = (o: Out, a: V3, b: V3, w: number, d: number, color: string, round?: true) =>
  o.fixtures.push({ a, b, w, d, color, round, after: o.members.length });
// Upright block standing on the centre of its base
const block = (o: Out, [x, y, z]: V3, [sx, sy, sz]: V3, color: string) => bar(o, [x, y, z], [x, y + sy, z], sz, sx, color);
// Column with its base plate set first
const column = (o: Out, x: number, z: number, y0: number, y1: number) => {
  if (y0 === 0) add(o, [x, 0, z], [x, 0.02, z], 'plate');
  add(o, [x, y0, z], [x, y1, z], 'col');
};

const officeFrame = (r: Rng, o: Out) => {
  const nx = int(r, 3, 5), nz = int(r, 2, 3), floors = int(r, 3, 7);
  const bx = 1, bz = 0.9, h = 0.52;
  const setback = floors >= 5 && r() < 0.6 ? floors - 2 : floors;
  const braceX = Math.floor(nx / 2);
  const hoistZ = nz * bz - 0.3;
  // Slip-formed lift and stair core is cast ahead of the steel
  o.statics.push({ pos: [0.5 * bx, (floors * h + 0.25) / 2, 0.5 * bz], size: [bx * 0.84, floors * h + 0.25, bz * 0.84], color: '#B9BDC3' });

  for (let f = 0; f < floors; f++) {
    const y0 = f * h, y1 = (f + 1) * h;
    const xn = f >= setback ? nx - 1 : nx;
    for (let i = 0; i <= xn; i++) for (let j = 0; j <= nz; j++) column(o, i * bx, j * bz, y0, y1);
    for (let j = 0; j <= nz; j++) for (let i = 0; i < xn; i++) add(o, [i * bx, y1, j * bz], [(i + 1) * bx, y1, j * bz], 'girder');
    for (let i = 0; i <= xn; i++) for (let j = 0; j < nz; j++) add(o, [i * bx, y1, j * bz], [i * bx, y1, (j + 1) * bz], 'girder');
    for (let i = 0; i < xn; i++)
      for (const s of [1 / 3, 2 / 3]) for (let j = 0; j < nz; j++) add(o, [(i + s) * bx, y1, j * bz], [(i + s) * bx, y1, (j + 1) * bz], 'beam');
    // Chevron bracing in the core bays
    add(o, [braceX * bx, y0, 0], [(braceX + 0.5) * bx, y1, 0], 'brace');
    add(o, [(braceX + 1) * bx, y0, 0], [(braceX + 0.5) * bx, y1, 0], 'brace');
    add(o, [nx * bx, y0, 0], [nx * bx, y1, 0.5 * bz], 'brace');
    add(o, [nx * bx, y0, bz], [nx * bx, y1, 0.5 * bz], 'brace');
    sheet(o, [0, y1 + 0.05, 0], [xn * bx, 0, 0], [0, 0, nz * bz], 'deck');
    // Edge protection on the open elevations: posts, mid and top rails, toe board
    const ez = nz * bz + 0.03, ex = xn * bx + 0.03, yd = y1 + 0.08;
    for (const dy of [0.075, 0.145]) {
      bar(o, [0, yd + dy, ez], [xn * bx, yd + dy, ez], 0.008, 0.008, FIT.safety);
      bar(o, [ex, yd + dy, 0], [ex, yd + dy, nz * bz], 0.008, 0.008, FIT.safety);
    }
    bar(o, [0, yd, ez], [xn * bx, yd, ez], 0.004, 0.03, FIT.safety);
    for (let i = 0; i < xn; i++) bar(o, [(i + 0.5) * bx, yd, ez], [(i + 0.5) * bx, yd + 0.15, ez], 0.008, 0.008, FIT.safety);
    // Rack-and-pinion hoist climbs with the frame, tied in at every floor
    bar(o, [-0.17, y0, hoistZ], [-0.17, y1, hoistZ], 0.05, 0.05, FIT.hoist);
    bar(o, [-0.145, y1 - 0.06, hoistZ], [-0.045, y1 - 0.06, hoistZ], 0.012, 0.012, FIT.hoist);
    if (f === 0) block(o, [-0.26, 0, hoistZ], [0.12, 0.16, 0.14], FIT.safety);
    // Curtain wall follows on the two rear elevations, leaving the steel on view at the front
    for (let j = 0; j < nz; j++) sheet(o, [-0.045, y0 + 0.06, j * bz], [0, 0, bz], [0, h, 0], 'glass');
    for (let i = 0; i < xn; i++) sheet(o, [i * bx, y0 + 0.06, -0.045], [bx, 0, 0], [0, h, 0], 'glass');
    if (f === floors - 1 || f === setback - 1) {
      // Roof parapet
      sheet(o, [0, y1 + 0.07, -0.02], [xn * bx, 0, 0], [0, 0.09, 0], 'wall');
      sheet(o, [-0.02, y1 + 0.07, 0], [0, 0, nz * bz], [0, 0.09, 0], 'wall');
    }
  }
  // Roof plant goes in once the frame is topped out: air handlers, a cooling tower, ductwork and a mast
  const top = (floors > setback ? nx - 1 : nx) * bx, yr = floors * h + 0.065, zm = nz * bz;
  block(o, [top * 0.62, yr, zm * 0.6], [Math.min(0.7, top * 0.32), 0.13, 0.24], FIT.plant);
  for (const dx of [-0.12, 0.12]) bar(o, [top * 0.62 + dx, yr + 0.13, zm * 0.6], [top * 0.62 + dx, yr + 0.145, zm * 0.6], 0.09, 0.09, FIT.fan, true);
  block(o, [top - 0.32, yr, zm * 0.25], [0.24, 0.17, 0.24], FIT.plant);
  bar(o, [top - 0.32, yr + 0.17, zm * 0.25], [top - 0.32, yr + 0.2, zm * 0.25], 0.17, 0.17, FIT.fan, true);
  bar(o, [top - 0.32, yr + 0.05, zm * 0.25 + 0.12], [top - 0.32, yr + 0.05, zm * 0.6 - 0.12], 0.06, 0.06, FIT.galv);
  bar(o, [top * 0.62 - 0.36, yr + 0.06, zm * 0.6], [0.5 * bx + 0.42, yr + 0.06, zm * 0.6], 0.07, 0.07, FIT.galv);
  bar(o, [top - 0.08, yr, zm - 0.1], [top - 0.08, yr + 0.42, zm - 0.1], 0.012, 0.012, FIT.galv, true);
  return 'Steel-framed office';
};

const warehouse = (r: Rng, o: Out) => {
  const n = int(r, 5, 8), bay = 0.9, span = range(r, 2.4, 3.1), e = range(r, 0.85, 1.15);
  const ridge = e + (span / 2) * 0.16;
  const roofY = (z: number) => e + (ridge - e) * (Math.min(z, span - z) / (span / 2));
  const slopes = [0.22, 0.48, 0.74, 0.97];
  const skylight = int(r, 2, 3);
  const dockBays = Math.floor(n / 2);
  for (let k = 0; k < n; k++) {
    const x = k * bay, px = x - bay;
    column(o, x, 0, 0, e);
    column(o, x, span, 0, e);
    add(o, [x, e, 0], [x, ridge, span / 2], 'girder');
    add(o, [x, ridge, span / 2], [x, e, span], 'girder');
    // Haunches at the knees
    add(o, [x, e - 0.16, 0.01], [x, roofY(0.32), 0.32], 'girder');
    add(o, [x, e - 0.16, span - 0.01], [x, roofY(span - 0.32), span - 0.32], 'girder');
    if (k === 0 || k === n - 1) for (const z of [span / 3, (2 * span) / 3]) column(o, x, z, 0, roofY(z));
    if (k === 0) {
      for (const y of [e * 0.35, e * 0.7]) add(o, [x, y, 0], [x, y, span], 'purlin');
      continue;
    }
    add(o, [px, e, 0], [x, e, 0], 'beam');
    add(o, [px, e, span], [x, e, span], 'beam');
    for (const t of slopes) {
      const z = (t * span) / 2;
      add(o, [px, roofY(z) + 0.04, z], [x, roofY(z) + 0.04, z], 'purlin');
      add(o, [px, roofY(span - z) + 0.04, span - z], [x, roofY(span - z) + 0.04, span - z], 'purlin');
    }
    for (const y of [e * 0.35, e * 0.7]) {
      add(o, [px, y, 0], [x, y, 0], 'purlin');
      add(o, [px, y, span], [x, y, span], 'purlin');
    }
    if (k === 1 || k === n - 1) {
      add(o, [px, e, 0], [x, ridge, span / 2], 'rod');
      add(o, [x, e, 0], [px, ridge, span / 2], 'rod');
      add(o, [px, ridge, span / 2], [x, e, span], 'rod');
      add(o, [x, ridge, span / 2], [px, e, span], 'rod');
      add(o, [px, 0, 0], [x, e, 0], 'rod');
      add(o, [x, 0, 0], [px, e, 0], 'rod');
    }
    // Roof sheeting (with rooflights) and the far side wall follow the steel bay by bay; the near side stays open.
    sheet(o, [px, e + 0.07, 0], [bay, 0, 0], [0, ridge - e, span / 2], k % skylight === 0 ? 'glass' : 'roof');
    sheet(o, [px, ridge + 0.07, span / 2], [bay, 0, 0], [0, e - ridge, span / 2], 'roof');
    sheet(o, [px, 0, -0.03], [bay, 0, 0], [0, e, 0], 'wall');
    sheet(o, [px + bay * 0.3, ridge + 0.13, span / 2 - 0.12], [bay * 0.4, 0, 0], [0, 0, 0.24], 'roof');
    // Eaves gutters and downpipes
    for (const z of [-0.07, span + 0.07]) bar(o, [px, e + 0.04, z], [x, e + 0.04, z], 0.05, 0.035, FIT.galv);
    if (k % 2) bar(o, [x - 0.06, 0, -0.07], [x - 0.06, e + 0.04, -0.07], 0.022, 0.022, FIT.galv, true);
    // The first bays of the near side are clad with dock doors; the rest stays open on the steel and fit-out
    if (k <= dockBays) {
      const xc = px + bay / 2, zw = span + 0.03;
      sheet(o, [px, 0, zw], [bay, 0, 0], [0, e, 0], 'wall');
      bar(o, [xc, 0.15, zw + 0.012], [xc, 0.62, zw + 0.012], 0.012, bay * 0.56, FIT.shutter);
      for (let y = 0.2; y < 0.6; y += 0.07) bar(o, [xc - bay * 0.28, y, zw + 0.02], [xc + bay * 0.28, y, zw + 0.02], 0.004, 0.006, FIT.plantDark);
      block(o, [xc, 0, zw + 0.06], [bay * 0.64, 0.15, 0.08], FIT.concrete);
      for (const dx of [-0.21, 0.21]) block(o, [xc + dx, 0.06, zw + 0.11], [0.035, 0.07, 0.02], FIT.rubber);
      block(o, [xc, 0.68, zw + 0.09], [bay * 0.72, 0.016, 0.14], FIT.plant);
    }
  }
  sheet(o, [-0.03, 0, 0], [0, 0, span], [0, e, 0], 'wall');
  // Pallet racking fitted out after the shell: uprights, beam levels and loads
  const x0 = bay * 0.25, x1 = (n - 1) * bay - 0.25, slot = 0.3, levels = [0, e * 0.25, e * 0.5, e * 0.75];
  for (const zr of [span * 0.28, span * 0.6]) {
    for (const z of [zr, zr + 0.2]) {
      for (let xu = x0; xu <= x1 + 1e-6; xu += slot) bar(o, [xu, 0, z], [xu, e * 0.8, z], 0.016, 0.016, FIT.upright);
      for (const y of levels.slice(1)) bar(o, [x0, y, z], [x1, y, z], 0.01, 0.022, FIT.rackBeam);
    }
    for (const y of levels)
      for (let xs = x0 + slot / 2; xs < x1; xs += slot)
        if (r() > 0.18) block(o, [xs, y + 0.012, zr + 0.1], [slot * 0.8, e * 0.25 * range(r, 0.55, 0.8), 0.17], r() < 0.6 ? FIT.carton : FIT.wrap);
  }
  return 'Pre-engineered warehouse';
};

const conveyor = (r: Rng, o: Out) => {
  const L = range(r, 4.2, 5.4), w = 0.5, d = 0.42, H = range(r, 1.8, 2.4), panels = int(r, 7, 10);
  const yAt = (t: number) => 0.2 + t * (H - 0.2);
  const trestle = (x: number, top: number) => {
    const z0 = -0.12, z1 = w + 0.12, hw = 0.22;
    for (const [dx, z] of [[-hw, z0], [hw, z0], [-hw, z1], [hw, z1]]) column(o, x + dx, z, 0, top);
    const levels = Math.max(1, Math.round(top / 0.6));
    for (let l = 1; l <= levels; l++) {
      const y = (l * top) / levels, yp = ((l - 1) * top) / levels;
      for (const z of [z0, z1]) {
        add(o, [x - hw, y, z], [x + hw, y, z], 'beam');
        add(o, [x - hw, yp, z], [x + hw, y, z], 'brace');
        add(o, [x + hw, yp, z], [x - hw, y, z], 'brace');
      }
      add(o, [x - hw, y, z0], [x - hw, y, z1], 'beam');
      add(o, [x + hw, y, z0], [x + hw, y, z1], 'beam');
    }
  };
  column(o, 0, 0, 0, yAt(0));
  column(o, 0, w, 0, yAt(0));
  trestle(L * 0.34, yAt(0.34));
  trestle(L * 0.68, yAt(0.68));

  // Transfer tower at the head end, with a clad drive house on top
  const tx0 = L, tx1 = L + 1, tz0 = -0.25, tz1 = w + 0.25, levels = [H * 0.5, H, H + d + 0.45];
  let yPrev = 0;
  for (const y of levels) {
    for (const [x, z] of [[tx0, tz0], [tx1, tz0], [tx0, tz1], [tx1, tz1]]) column(o, x, z, yPrev, y);
    add(o, [tx0, y, tz0], [tx1, y, tz0], 'girder');
    add(o, [tx0, y, tz1], [tx1, y, tz1], 'girder');
    add(o, [tx0, y, tz0], [tx0, y, tz1], 'girder');
    add(o, [tx1, y, tz0], [tx1, y, tz1], 'girder');
    add(o, [tx0 + 0.5, y, tz0], [tx0 + 0.5, y, tz1], 'beam');
    add(o, [tx0, yPrev, tz0], [tx1, y, tz0], 'brace');
    add(o, [tx0, yPrev, tz0], [tx0, y, tz1], 'brace');
    sheet(o, [tx0, y + 0.05, tz0], [1, 0, 0], [0, 0, tz1 - tz0], 'deck');
    // Stair flights with handrails up the tower, switching back at each landing
    if (y < H + 0.01) {
      const flip = yPrev > 0, xa = flip ? tx1 - 0.12 : tx0 + 0.12, xb = flip ? tx0 + 0.32 : tx1 - 0.32, zs = tz1 - 0.1;
      bar(o, [xa, yPrev + 0.06, zs], [xb, y + 0.06, zs], 0.12, 0.02, FIT.machine);
      bar(o, [xa, yPrev + 0.2, zs + 0.065], [xb, y + 0.2, zs + 0.065], 0.008, 0.008, FIT.safety);
    }
    yPrev = y;
  }
  // Head drive: pulley, gearbox and motor, with the discharge chute down to the lower landing
  bar(o, [L + 0.07, H + 0.1, 0.1], [L + 0.07, H + 0.1, w - 0.1], 0.13, 0.13, FIT.machine, true);
  block(o, [L + 0.07, H + 0.06, w + 0.02], [0.1, 0.09, 0.08], FIT.machine);
  bar(o, [L + 0.07, H + 0.105, w + 0.06], [L + 0.07, H + 0.105, w + 0.2], 0.08, 0.08, FIT.motor, true);
  block(o, [L + 0.3, H * 0.5 + 0.06, w / 2], [0.22, H * 0.5 - 0.04, 0.24], FIT.plantDark);
  // Feed hopper and tail pulley at the boot end
  bar(o, [-0.02, 0.27, 0.12], [-0.02, 0.27, w - 0.12], 0.1, 0.1, FIT.machine, true);
  block(o, [-0.12, 0.34, w / 2], [0.3, 0.22, 0.46], FIT.plantDark);
  block(o, [-0.12, 0, w / 2], [0.06, 0.34, 0.06], FIT.machine);
  sheet(o, [tx0, H, tz0 - 0.03], [1, 0, 0], [0, d + 0.45, 0], 'wall');
  sheet(o, [tx1 + 0.03, H, tz0], [0, 0, tz1 - tz0], [0, d + 0.45, 0], 'wall');

  for (let p = 0; p < panels; p++) {
    const t0 = p / panels, t1 = (p + 1) / panels;
    const xa = t0 * L, xb = t1 * L, ya = yAt(t0), yb = yAt(t1);
    for (const z of [0, w]) {
      add(o, [xa, ya, z], [xb, yb, z], 'truss');
      add(o, [xa, ya + d, z], [xb, yb + d, z], 'truss');
      add(o, [xb, yb, z], [xb, yb + d, z], 'truss');
      add(o, p % 2 ? [xa, ya, z] : [xa, ya + d, z], p % 2 ? [xb, yb + d, z] : [xb, yb, z], 'truss');
    }
    add(o, [xb, yb, 0], [xb, yb, w], 'beam');
    add(o, [xb, yb + d, 0], [xb, yb + d, w], 'beam');
    sheet(o, [xa, ya + 0.03, 0], [xb - xa, yb - ya, 0], [0, 0, w], 'deck');
    sheet(o, [xa, ya + 0.08, 0.16], [xb - xa, yb - ya, 0], [0, 0, 0.22], 'belt');
    sheet(o, [xa, ya + d + 0.05, -0.04], [xb - xa, yb - ya, 0], [0, 0, w + 0.08], 'roof');
    sheet(o, [xa, ya, -0.03], [xb - xa, yb - ya, 0], [0, d, 0], 'wall');
    // Inspection walkway handrail on the open side
    bar(o, [xa, ya + 0.19, w - 0.07], [xb, yb + 0.19, w - 0.07], 0.008, 0.008, FIT.safety);
  }
  return 'Conveyor gallery';
};

const pipeRack = (r: Rng, o: Out) => {
  const n = int(r, 6, 9), s = 0.8, W = 1.2;
  const tiers = r() < 0.45 ? [0.9, 1.35, 1.8] : [0.9, 1.4];
  const top = tiers[tiers.length - 1];
  for (let k = 0; k < n; k++) {
    const x = k * s, px = x - s;
    column(o, x, 0, 0, top);
    column(o, x, W, 0, top);
    for (const t of tiers) add(o, [x, t, 0], [x, t, W], 'girder');
    add(o, [x, tiers[0] - 0.25, 0], [x, tiers[0], 0.25], 'brace');
    add(o, [x, tiers[0] - 0.25, W], [x, tiers[0], W - 0.25], 'brace');
    if (k === 0) continue;
    for (const t of tiers) {
      add(o, [px, t, 0], [x, t, 0], 'beam');
      add(o, [px, t, W], [x, t, W], 'beam');
    }
    if (k === 2 || k === n - 2) {
      add(o, [px, 0, 0], [x, tiers[0], 0], 'brace');
      add(o, [x, 0, 0], [px, tiers[0], 0], 'brace');
      add(o, [px, 0, W], [x, tiers[0], W], 'brace');
      add(o, [x, 0, W], [px, tiers[0], W], 'brace');
    }
  }
  const len = (n - 1) * s;
  for (const t of tiers) {
    const count = int(r, 3, 5);
    for (let p = 0; p < count; p++) {
      const dia = range(r, 0.05, 0.13);
      const z = 0.12 + ((W - 0.36) * (p + 0.5)) / count;
      const color = PIPE_COLORS[int(r, 0, PIPE_COLORS.length - 1)];
      add(o, [-0.3, t + 0.045 + dia / 2, z], [len + 0.3, t + 0.045 + dia / 2, z], 'pipe', dia, color);
    }
  }
  // Cable tray along the top tier
  sheet(o, [-0.2, top + 0.06, W - 0.28], [len + 0.4, 0, 0], [0, 0, 0.2], 'deck');

  // Valve stations on the lower tier: flanged body, stem and handwheel
  const pipes = o.members.filter((m) => m.kind === 'pipe');
  for (const pp of pipes.filter((m) => m.a[1] < tiers[0] + 0.3).slice(0, 2)) {
    const dia = pp.size ?? 0.08, y = pp.a[1], z = pp.a[2], xv = s * int(r, 1, n - 2) + s / 2;
    bar(o, [xv - 0.045, y, z], [xv + 0.045, y, z], dia * 1.6, dia * 1.6, FIT.valve, true);
    for (const dx of [-0.06, 0.05]) bar(o, [xv + dx, y, z], [xv + dx + 0.012, y, z], dia * 1.45, dia * 1.45, FIT.valve, true);
    bar(o, [xv, y, z], [xv, y + dia + 0.07, z], 0.01, 0.01, FIT.machine, true);
    bar(o, [xv, y + dia + 0.07, z], [xv, y + dia + 0.078, z], 0.07, 0.07, FIT.safety, true);
  }
  // One line drops at the far end to a pump on its skid
  const drop = pipes[1];
  if (drop) {
    const dia = drop.size ?? 0.08, xd = len + 0.24, z = drop.a[2];
    bar(o, [xd, drop.a[1], z], [xd, 0.08, z], dia, dia, drop.color ?? FIT.galv, true);
    bar(o, [xd, 0.08, z], [len + 0.06, 0.08, W / 2], dia, dia, drop.color ?? FIT.galv, true);
    block(o, [len - 0.1, 0, W / 2], [0.4, 0.03, 0.16], FIT.concrete);
    bar(o, [len - 0.02, 0.08, W / 2], [len - 0.22, 0.08, W / 2], 0.08, 0.08, FIT.valve, true);
    block(o, [len + 0.02, 0.03, W / 2], [0.09, 0.1, 0.1], FIT.valve);
  }
  // Access ladder with rest platform and handrailed walkway along the top tier
  const lx = -0.09;
  for (const z of [-0.06, 0.06]) bar(o, [lx, 0, z], [lx, top + 0.22, z], 0.012, 0.012, FIT.safety);
  for (let y = 0.08; y < top + 0.05; y += 0.08) bar(o, [lx, y, -0.06], [lx, y, 0.06], 0.006, 0.006, FIT.safety);
  block(o, [-0.05, top + 0.05, W * 0.12], [0.16, 0.012, W * 0.24], FIT.galv);
  for (const dy of [0.1, 0.18]) bar(o, [-0.2, top + 0.05 + dy, 0.02], [len + 0.2, top + 0.05 + dy, 0.02], 0.008, 0.008, FIT.safety);
  for (let k = 0; k < n; k++) bar(o, [k * s, top + 0.05, 0.02], [k * s, top + 0.23, 0.02], 0.008, 0.008, FIT.safety);
  return 'Process pipe rack';
};

const BUILDERS = [officeFrame, warehouse, conveyor, pipeRack];
let nextId = 0;

const TARGET_SIZE = 2.1;
// Site slab margins around the structure footprint; the back leaves room for the crane and cabins.
export const SLAB = { side: 0.35, back: 0.65, front: 0.3 };

export const generateStructure = (avoidType?: string): Structure => {
  const r = mulberry32(Math.floor(Math.random() * 2 ** 31));
  let out: Out = { members: [], panels: [], statics: [], fixtures: [] };
  const idx = int(r, 0, BUILDERS.length - 1);
  let type = BUILDERS[idx](r, out);
  // Never erect the same kind of structure twice in a row at one site.
  if (type === avoidType) {
    out = { members: [], panels: [], statics: [], fixtures: [] };
    type = BUILDERS[(idx + int(r, 1, BUILDERS.length - 1)) % BUILDERS.length](r, out);
  }

  const pts = out.members.flatMap((m) => [m.a, m.b]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), zs = pts.map((p) => p[2]);
  const [minX, maxX, minZ, maxZ] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)];
  const height = Math.max(...ys);
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
  const shift = (p: V3): V3 => [p[0] - cx, p[1], p[2] - cz];
  const members = out.members.map((m) => ({ ...m, a: shift(m.a), b: shift(m.b) }));
  const panels = out.panels.map((p) => ({ ...p, o: shift(p.o) }));
  const statics = out.statics.map((b) => ({ ...b, pos: shift(b.pos) }));
  // Concrete pad footings cast under every column base before the steel arrives
  for (const m of members) if (m.kind === 'plate') statics.push({ pos: [m.a[0], 0.03, m.a[2]], size: [0.19, 0.06, 0.19], color: '#C9CCD0' });
  const fixtures = out.fixtures.map((f) => ({ ...f, a: shift(f.a), b: shift(f.b) }));
  const half: [number, number] = [(maxX - minX) / 2, (maxZ - minZ) / 2];

  // Tower crane stands at the middle of the back side, tall enough to clear the structure.
  const crane = { x: 0, z: -half[1] - 0.4, height: height + 0.4, reach: Math.hypot(half[0] + 0.25, half[1] * 2 + 0.6) };

  let lbs = 0;
  for (const m of members) lbs += Math.hypot(m.a[0] - m.b[0], m.a[1] - m.b[1], m.a[2] - m.b[2]) * 25 * LB_PER_FT[m.kind];

  return {
    id: ++nextId,
    type,
    job: `3A-${int(r, 1100, 9899)}`,
    members,
    panels,
    statics,
    fixtures,
    height,
    half,
    scale: TARGET_SIZE / Math.max(half[0] * 2 + SLAB.side * 2, half[1] * 2 + SLAB.back + SLAB.front, height * 1.1),
    crane,
    tons: lbs / 2000,
    duration: range(r, 60, 85)
  };
};
