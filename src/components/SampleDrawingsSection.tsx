import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Download, Check, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { tone } from '../theme';
import type { SampleDrawing } from '../types';
import { SAMPLE_DRAWINGS } from '../data/siteData';

type Filter = 'all' | SampleDrawing['category'];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Sheets' },
  { id: 'shop', label: 'Shop Drawings' },
  { id: 'ab', label: 'Anchor Bolt & Embed' },
  { id: 'structural', label: 'Structural Steel' },
  { id: 'misc', label: 'Miscellaneous Steel' }
];

const CATEGORY_INFO: Record<SampleDrawing['category'], { code: string; desc: string }> = {
  shop: {
    code: 'SD',
    desc: 'Fabrication-ready assembly and part drawings with bill of materials, bolt lists and weld callouts.'
  },
  ab: {
    code: 'AB',
    desc: 'Anchor bolt and embed layouts for the concrete contractor, set out to grid lines and elevations.'
  },
  structural: {
    code: 'SF',
    desc: 'Framing plans locating every beam, column and brace, with member marks and connection references.'
  },
  misc: {
    code: 'MS',
    desc: 'Stairs, landings, handrails, ladders and other miscellaneous metals detailed for shop and site.'
  }
};

// Category colour follows the order of the filter tabs (blue, orange, green, blue)
const categoryTone = (c: SampleDrawing['category']) => tone(FILTERS.findIndex((f) => f.id === c) - 1);

const sheetNo = (d: SampleDrawing) => {
  const sameCat = SAMPLE_DRAWINGS.filter((x) => x.category === d.category);
  return `${CATEGORY_INFO[d.category].code}-${String(sameCat.indexOf(d) + 1).padStart(2, '0')}`;
};

const LOUPE = 190;
const ZOOM = 2.4;
const SPRING = { type: 'spring', stiffness: 110, damping: 19, mass: 0.9 } as const;

// Paper or blueprint rendering of a drawing. Blueprint mode inverts the sheet and screens it over blue,
// so black linework turns white on a blue ground.
const SheetFace: React.FC<{ src: string; blueprint: boolean; alt?: string }> = ({ src, blueprint, alt = '' }) => (
  <span className="absolute inset-0 isolate overflow-hidden bg-white">
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="h-full w-full object-cover transition-[filter] duration-500"
      style={{ filter: blueprint ? 'invert(1) contrast(1.15)' : 'none' }}
    />
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-[#0B4FB3] mix-blend-screen transition-opacity duration-500"
      style={{ opacity: blueprint ? 1 : 0 }}
    />
  </span>
);

export const SampleDrawingsSection: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState(SAMPLE_DRAWINGS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [loupe, setLoupe] = useState<{ x: number; y: number } | null>(null);
  const [stage, setStage] = useState({ w: 1200, h: 640 });
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, margin: '-120px' });
  const reduceMotion = useReducedMotion();
  const dealt = inView || !!reduceMotion;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStage({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const filtered = SAMPLE_DRAWINGS.filter((item) => filter === 'all' || item.category === filter);
  const activeIndex = Math.max(0, filtered.findIndex((d) => d.id === activeId));
  const active = filtered[activeIndex];
  const t = categoryTone(active.category);
  const tableSheets = filtered.filter((d) => d.id !== active.id);

  // Stage geometry. On wide screens the section fills the viewport and the stage takes the leftover
  // height, so the raised sheet is sized to fit both ways; on narrow screens it follows the width.
  const isWide = stage.w >= 900;
  const fanSpace = isWide ? Math.min(150, Math.max(96, stage.h * 0.27)) : 160;
  const UW = isWide ? Math.max(240, Math.min(780, stage.w * 0.62, (stage.h - 30 - fanSpace) * 1.5)) : stage.w * 0.92;
  const UH = (UW * 2) / 3;
  const raisedY = 30;
  const stageH = isWide ? stage.h : raisedY + UH + fanSpace;
  const tableCenterY = stageH - (isWide ? fanSpace * 0.5 : 70);
  const tableScale = isWide ? Math.min(0.32, Math.max(0.18, 125 / UW)) : 0.3;
  const spreadX = isWide ? Math.min(stage.w * 0.36, 460) : stage.w * 0.33;

  const go = (step: number) => setActiveId(filtered[(activeIndex + step + filtered.length) % filtered.length].id);
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  const changeFilter = (f: Filter) => {
    setFilter(f);
    const first = SAMPLE_DRAWINGS.find((d) => f === 'all' || d.category === f);
    if (first) setActiveId(first.id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight') goRef.current(1);
      if (e.key === 'ArrowLeft') goRef.current(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleLoupeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width / UW; // the raised sheet may be mid-animation, so map back to its untransformed size
    setLoupe({ x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k });
  };

  // Where a sheet sits: raised and facing the viewer, fanned on the table, or still in the undealt stack
  const placement = (d: SampleDrawing) => {
    if (d.id === active.id) {
      return { x: 0, y: raisedY, rotateX: 0, rotateZ: 0, scale: 1, opacity: 1, zIndex: 50 };
    }
    const i = tableSheets.indexOf(d);
    const n = tableSheets.length;
    const u = (n > 1 ? (i / (n - 1)) * 2 - 1 : 0) * Math.min(1, 0.35 + n * 0.08); // fewer sheets, tighter fan
    const top = tableCenterY - UH / 2;
    if (!dealt) {
      return { x: 0, y: top + 40, rotateX: 62, rotateZ: (i % 2 ? 1 : -1) * 3, scale: tableScale, opacity: 0, zIndex: 10 + i };
    }
    const lifted = hoveredId === d.id;
    return {
      x: u * spreadX,
      y: top + Math.abs(u) * 18 - (lifted ? 30 : 0),
      rotateX: lifted ? 38 : 56,
      rotateZ: u * 12,
      scale: tableScale * (lifted ? 1.12 : 1),
      opacity: 1,
      zIndex: lifted ? 40 : 10 + i
    };
  };

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:flex lg:h-[calc(100svh-76px)] lg:min-h-[600px] lg:flex-col lg:py-6">
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18,112,249,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(18,112,249,0.16) 1px, transparent 1px), linear-gradient(rgba(18,112,249,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(18,112,249,0.07) 1px, transparent 1px)',
          backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px'
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-logo/25 blur-[140px]" />

      <div className="container-x relative lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-6">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-light">Sample Drawings</span>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[36px] lg:mt-3 lg:text-[30px] xl:text-[34px]">
              Review our drawing quality, sheet by sheet.
            </h2>
            <p className="mt-3 text-[16px] leading-[1.65] text-white/65 lg:hidden">
              Select a drawing to bring it forward, then hover to magnify dimensions, callouts and bills of materials.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setBlueprint((b) => !b)}
            role="switch"
            aria-checked={blueprint}
            className="flex h-11 shrink-0 items-center gap-3 rounded-full border border-white/15 pl-4 pr-1.5 text-[14px] font-medium text-white/80 transition-colors hover:border-white/40"
          >
            Blueprint mode
            <span className={`relative h-7 w-12 rounded-full transition-colors ${blueprint ? 'bg-logo' : 'bg-white/15'}`}>
              <motion.span
                layout
                transition={SPRING}
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${blueprint ? 'right-1' : 'left-1'}`}
              />
            </span>
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-sm border-2 border-green bg-green/10 text-white hover:bg-green"
          >
            {downloaded ? <Check className="h-4 w-4" strokeWidth={1.75} /> : <Download className="h-4 w-4" strokeWidth={1.75} />}
            {downloaded ? 'Download started' : 'Sample Package (PDF)'}
          </button>
          </div>
        </div>

        {/* Filters + blueprint toggle */}
        <div className="mt-10 flex flex-col gap-4 lg:mt-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => {
              const count = SAMPLE_DRAWINGS.filter((d) => f.id === 'all' || d.category === f.id).length;
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => changeFilter(f.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors ${
                    isActive ? 'border-white bg-white text-ink' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {f.label}
                  <span className={`rounded-full px-2 py-0.5 text-[12px] tabular-nums ${isActive ? 'bg-ink text-white' : 'bg-white/10 text-white/60'}`}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D drafting table */}
        <div ref={stageRef} className="relative mt-8 select-none lg:mt-2 lg:min-h-0 lg:flex-1" style={{ height: isWide ? undefined : stageH }}>
          {/* Table surface: a receding grid plane with a pool of light under the fan */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 [perspective:900px]" style={{ height: stageH - raisedY - UH * 0.55 }}>
            <div
              className="absolute inset-x-[-20%] bottom-[-30%] top-0 origin-bottom [transform:rotateX(68deg)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
              }}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-logo/20 blur-[60px]"
            style={{ top: tableCenterY - 70, width: spreadX * 2.2, height: 160 }}
          />

          {/* Dimension line above the raised sheet */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.08em] text-white/55"
            style={{ width: UW }}
          >
            <span className="h-3 w-px bg-white/40" />
            <span className="h-px flex-1 bg-white/30" />
            <AnimatePresence mode="wait">
              <motion.span
                key={active.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                <span className="text-white">{sheetNo(active)}</span>
                <span className="mx-2 text-white/30">|</span>
                {active.categoryLabel}
              </motion.span>
            </AnimatePresence>
            <span className="h-px flex-1 bg-white/30" />
            <span className="h-3 w-px bg-white/40" />
          </div>

          <AnimatePresence>
            {filtered.map((d) => {
              const isActive = d.id === active.id;
              const p = placement(d);
              return (
                <motion.div
                  key={d.id}
                  initial={{ ...p, opacity: 0, y: p.y + 160 }}
                  animate={p}
                  exit={{ opacity: 0, y: p.y + 160, rotateZ: p.rotateZ * 1.6, transition: { duration: 0.35 } }}
                  transition={{
                    ...SPRING,
                    delay: !isActive && dealt && !hoveredId ? tableSheets.indexOf(d) * 0.04 : 0,
                    opacity: { duration: 0.3 }
                  }}
                  style={{
                    width: UW,
                    height: UH,
                    left: '50%',
                    marginLeft: -UW / 2,
                    transformPerspective: isActive ? 1600 : 2600,
                    zIndex: p.zIndex
                  }}
                  className={`absolute top-0 ${isActive ? 'cursor-zoom-in' : 'cursor-pointer'}`}
                  onPointerEnter={() => !isActive && setHoveredId(d.id)}
                  onPointerLeave={() => {
                    if (!isActive) setHoveredId(null);
                    else setLoupe(null);
                  }}
                  onPointerMove={isActive ? handleLoupeMove : undefined}
                  onClick={() => {
                    if (isActive) setIsFullscreen(true);
                    else {
                      setHoveredId(null);
                      setActiveId(d.id);
                    }
                  }}
                  role="button"
                  aria-label={isActive ? `Open ${d.title} full screen` : `Pick up ${d.title}`}
                >
                  <div
                    className={`absolute inset-0 overflow-hidden rounded-[3px] transition-shadow duration-500 ${
                      isActive
                        ? 'shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]'
                        : 'shadow-[0_30px_40px_-10px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    <SheetFace src={isActive ? d.full : d.image} blueprint={blueprint} alt={d.title} />

                    {/* Sheet number label printed on table sheets */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 right-0 bg-ink/85 px-6 py-3 text-[38px] font-semibold tracking-[0.04em] text-white">
                        {sheetNo(d)}
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <>
                      {/* Tape strips */}
                      <span aria-hidden="true" className="absolute -left-5 -top-3 h-7 w-24 -rotate-[32deg] bg-[#F3E6C4]/80 shadow-sm backdrop-blur-[1px]" />
                      <span aria-hidden="true" className="absolute -right-5 -top-3 h-7 w-24 rotate-[32deg] bg-[#F3E6C4]/80 shadow-sm backdrop-blur-[1px]" />

                      {/* Magnifier */}
                      {loupe && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute z-10 isolate overflow-hidden rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(20,33,61,0.25),0_18px_40px_-8px_rgba(0,0,0,0.6)]"
                          style={{ width: LOUPE, height: LOUPE, left: loupe.x - LOUPE / 2, top: loupe.y - LOUPE / 2 }}
                        >
                          <span
                            className="absolute inset-0 bg-white"
                            style={{
                              backgroundImage: `url(${d.full})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: `${UW * ZOOM}px ${UH * ZOOM}px`,
                              backgroundPosition: `${-(loupe.x * ZOOM - LOUPE / 2)}px ${-(loupe.y * ZOOM - LOUPE / 2)}px`,
                              filter: blueprint ? 'invert(1) contrast(1.15)' : 'none'
                            }}
                          />
                          {blueprint && <span className="absolute inset-0 bg-[#0B4FB3] mix-blend-screen" />}
                          <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-accent" />
                          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-accent" />
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Title strip + controls */}
        <div className="relative mt-6 grid grid-cols-1 items-center gap-6 rounded-[12px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6 lg:mt-3 lg:grid-cols-12 lg:gap-4 lg:px-5 lg:py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-4 lg:col-span-8"
            >
              <span className={`flex h-10 shrink-0 items-center rounded-[6px] px-3 text-[13px] font-semibold tracking-[0.04em] text-white tabular-nums ${t.solid}`}>
                {sheetNo(active)}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[18px] font-semibold leading-[1.25]">{active.title}</h3>
                <p className="mt-0.5 text-[14px] leading-[1.55] text-white/60 lg:truncate">{CATEGORY_INFO[active.category].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 lg:col-span-4 lg:justify-end">
            <span className="mr-2 text-[13px] tabular-nums text-white/50">
              {String(activeIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => go(-1)}
              aria-label="Previous sheet"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next sheet"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="ml-auto flex h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-[14px] font-medium text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink lg:ml-2"
            >
              <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
              Full screen
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8" onClick={(e) => e.stopPropagation()}>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-white/55">
                  {sheetNo(active)} · {active.categoryLabel}
                </p>
                <h3 className="mt-1 font-display text-[18px] font-semibold">{active.title}</h3>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-20" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[3/2] w-full max-w-[min(100%,calc(82vh*1.5))] overflow-hidden rounded-[4px] shadow-2xl">
                <SheetFace src={active.full} blueprint={blueprint} alt={active.title} />
              </div>
              {[-1, 1].map((step) => (
                <button
                  key={step}
                  onClick={() => go(step)}
                  aria-label={step < 0 ? 'Previous sheet' : 'Next sheet'}
                  className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink sm:flex ${step < 0 ? 'left-4' : 'right-4'}`}
                >
                  {step < 0 ? <ChevronLeft className="h-6 w-6" strokeWidth={1.75} /> : <ChevronRight className="h-6 w-6" strokeWidth={1.75} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
