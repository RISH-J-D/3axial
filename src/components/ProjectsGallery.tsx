import React, { useState, useEffect, useRef } from 'react';


import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/siteData';
import { tone } from '../theme';
import { Skeleton } from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Types & constants

type Filter = 'all' | 'completed' | 'ongoing' | 'commercial' | 'industrial' | 'educational';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'educational', label: 'Educational' },
  { id: 'completed', label: 'Completed' },
  { id: 'ongoing', label: 'Ongoing' }
];

interface ProjectsGalleryProps { onOpenEnquire?: () => void; }

const EASE = [0.22, 1, 0.36, 1] as const;

// Editorial rhythm in groups of seven: wide‑narrow / narrow‑wide / three narrow, so every row fills.
const isWide = (i: number) => i % 7 === 0 || i % 7 === 3;

// ---- Project Card ---------------------------------------------------------
const ProjectCard: React.FC<{ proj: Project; idx: number; onOpen: () => void }> = ({ proj, idx, onOpen }) => {
  const wide = isWide(idx);
  const t = tone(idx);
  const [tons, unit] = (proj.tonnage ?? '').split(' ');
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.07, ease: EASE }}
      className={`group flex flex-col text-left ${wide ? 'lg:col-span-2' : ''}`}
      onClick={onOpen}
    >
      <div className={`relative isolate overflow-hidden bg-white ring-1 ring-inset ring-ink/10 ${wide ? 'aspect-[4/3] lg:aspect-[2/1]' : 'aspect-[4/3]'}`}>
        <img
          src={proj.image}
          alt={proj.title}
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:[filter:invert(1)_contrast(1.15)]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[#0B4FB3] opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
        {/* Drafting grid shows through on the blueprint */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Sheet index */}
        <span className={`absolute left-5 top-5 flex h-10 w-10 items-center justify-center bg-white font-serif text-[20px] italic shadow-sm ${t.text}`}>{String(idx + 1).padStart(2, '0')}</span>
        {/* Status */}
        <span className="absolute right-5 top-5 flex items-center gap-2 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${proj.category === 'ongoing' ? 'bg-accent animate-pulse' : 'bg-green'}`} />
          {proj.category === 'ongoing' ? 'In progress' : 'Delivered'}
        </span>
        {/* Title block */}
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-4 bg-night/90 px-6 py-4 text-white backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">View project sheet</span>
          <ArrowUpRight className="h-4 w-4 text-accent" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-6 flex items-start justify-between gap-6 border-t border-line pt-5">
        <div className="min-w-0">
          <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${t.text}`}>{proj.sector}</span>
          <h3 className={`mt-2 font-display font-semibold leading-[1.15] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand ${wide ? 'text-[24px] lg:text-[30px]' : 'text-[22px]'}`}>{proj.title}</h3>
          {proj.location && (
            <p className="mt-2 flex items-center gap-1.5 text-[14px] text-muted">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
              {proj.location}
            </p>
          )}
        </div>
        {tons && (
          <div className="shrink-0 text-right">
            <div className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink">{tons}</div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">{unit ?? 'tons'} of steel</div>
          </div>
        )}
      </div>
    </motion.button>
  );
};

const ProjectImageViewer: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset view when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
      setZoom(prev => {
        const next = Math.min(Math.max(1, Number((prev * zoomFactor).toFixed(2))), 5);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleDoubleClick = () => {
    if (zoom > 1) { setZoom(1); setPosition({ x: 0, y: 0 }); }
    else setZoom(2.2);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      touchStartRef.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && zoom > 1) {
      setPosition({ x: e.touches[0].clientX - touchStartRef.current.x, y: e.touches[0].clientY - touchStartRef.current.y });
    }
  };
  const handleTouchEnd = () => setIsDragging(false);
  const zoomIn = () => setZoom(z => Math.min(5, Number((z + 0.5).toFixed(1))));
  const zoomOut = () => setZoom(z => { const next = Math.max(1, Number((z - 0.5).toFixed(1))); if (next === 1) setPosition({ x: 0, y: 0 }); return next; });
  const resetZoom = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative flex min-h-[350px] sm:min-h-[440px] lg:min-h-[500px] h-full max-h-[75vh] w-full items-center justify-center overflow-hidden bg-surface/80 p-4 select-none lg:col-span-3 ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
    >
      <img src={src} alt={alt} draggable={false} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, transition: isDragging ? 'none' : 'transform 0.15s ease-out' }} className="max-h-[68vh] w-auto max-w-full object-contain pointer-events-none select-none" />
      {/* Toolbar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-full border border-line bg-white/95 px-2.5 py-1.5 shadow-[0_4px_16px_-4px_rgba(20,33,61,0.2)] backdrop-blur-md transition-opacity" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} onDoubleClick={e => e.stopPropagation()}>
        <button type="button" onClick={zoomOut} disabled={zoom <= 1} className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface disabled:opacity-35 disabled:hover:bg-transparent" title="Zoom out (-)" aria-label="Zoom out"><ZoomOut className="h-4 w-4" strokeWidth={1.75} /></button>
        <span className="min-w-[42px] px-1 text-center font-display text-[12px] font-semibold tabular-nums text-ink">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={zoomIn} disabled={zoom >= 5} className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface disabled:opacity-35 disabled:hover:bg-transparent" title="Zoom in (+)" aria-label="Zoom in"><ZoomIn className="h-4 w-4" strokeWidth={1.75} /></button>
        {zoom > 1 && (
          <>
            <span className="h-4 w-px bg-line" />
            <button type="button" onClick={resetZoom} className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink" title="Reset view" aria-label="Reset view"><RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /></button>
          </>
        )}
      </div>
      <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-[2px] bg-white/80 px-2 py-1 text-[11px] font-medium tracking-[0.02em] text-muted shadow-xs backdrop-blur-sm">{zoom > 1 ? 'Drag to pan · Scroll to zoom' : 'Click / Scroll to zoom'}</div>
    </div>
  );
};

// ---- Main Gallery ----------------------------------------------------------
export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ onOpenEnquire }) => {
  // Loading + filter state
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightbox, setActiveLightbox] = useState<Project | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    if (!activeLightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeLightbox]);

  const q = searchQuery.toLowerCase();
  const filteredProjects = PROJECTS_DATA.filter(proj => {
    const matchesFilter = filter === 'all' || proj.category === filter || proj.sector === filter;
    const matchesSearch = proj.title.toLowerCase().includes(q) || (proj.location?.toLowerCase().includes(q) ?? false) || (proj.tonnage?.toLowerCase().includes(q) ?? false);
    return matchesFilter && matchesSearch;
  });
  const totalTons = filteredProjects.reduce((sum, p) => sum + (parseInt((p.tonnage ?? '').replace(/,/g, ''), 10) || 0), 0);

  const renderContent = () => {
    if (isLoading) {
      // Show 6 placeholder skeleton cards matching the grid layout
      return (
        <motion.div layout className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group flex flex-col text-left">
              <Skeleton height="[200px]" className="mb-4" />
              <Skeleton height="h-4" width="w-3/4" className="mb-2" />
              <Skeleton height="h-4" width="w-1/2" />
            </div>
          ))}
        </motion.div>
      );
    }
    return (
      <motion.div layout className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProjects.map((proj, idx) => (
            <ProjectCard key={proj.id} proj={proj} idx={idx} onOpen={() => setActiveLightbox(proj)} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="draft-grid-light absolute inset-0" />
      <div className="container-x relative">
        {/* Controls */}
        <div className="flex flex-col gap-6 border-b border-line lg:flex-row lg:items-end lg:justify-between">
          <div className="-mb-px flex gap-7 overflow-x-auto">
            {FILTERS.map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className={`tab whitespace-nowrap ${filter === tab.id ? 'tab-active' : ''}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative mb-4 w-full lg:w-72">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
            <input type="text" placeholder="Search by name, location or tonnage" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full border-0 border-b border-line bg-transparent py-2 pl-7 text-[14px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none" />
          </div>
        </div>
        {/* Register line */}
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span><span className="text-ink">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
          {totalTons > 0 && (
            <span><span className="text-ink">{totalTons.toLocaleString()}</span> tons detailed</span>
          )}
          <span className="hidden items-center gap-2 sm:flex"><span className="h-px w-6 bg-line" />Hover a model to see it as a blueprint</span>
        </div>
        {/* Grid */}
        {renderContent()}
        {filteredProjects.length === 0 && (<p className="py-20 text-center text-[15px] text-muted">No projects match your search.</p>)}
        {onOpenEnquire && (
          <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-[28px] font-semibold tracking-[-0.025em] text-ink">Have a <em className="text-accent-dark">similar</em> project?</h3>
              <p className="mt-2 text-[15px] text-muted">Send us your structural drawings — preliminary tender models and ABM lists in 24 to 48 hours.</p>
            </div>
            <button onClick={onOpenEnquire} className="btn-accent">Request a Bid Estimate<ArrowUpRight className="h-4 w-4" strokeWidth={1.75} /></button>
          </div>
        )}
      </div>
      {/* Lightbox */}
      {activeLightbox && (
        <div className="modal-backdrop" onClick={() => setActiveLightbox(null)}>
          <div className="modal-panel max-w-5xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={activeLightbox.title}>
            <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-5">
              <ProjectImageViewer src={activeLightbox.image} alt={activeLightbox.title} />
              <div className="relative flex flex-col p-8 lg:col-span-2 lg:p-10">
                <button onClick={() => setActiveLightbox(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink" aria-label="Close"><X className="h-5 w-5" strokeWidth={1.75} /></button>
                <span className="eyebrow capitalize">{activeLightbox.sector}</span>
                <h3 className="mt-4 pr-8 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">{activeLightbox.title}</h3>
                <dl className="mt-8 divide-y divide-line border-y border-line text-[14px]">
                  {[
                    ['Location', activeLightbox.location],
                    ['Tonnage', activeLightbox.tonnage],
                    ['Status', activeLightbox.category === 'completed' ? 'Completed' : 'Ongoing']
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium text-ink">{v || '—'}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[15px] leading-[1.7] text-muted">{activeLightbox.description} Detailed to AISC / CISC specifications with Tekla Structures 3D modelling, complete shop drawings, anchor bolt plans and an Advance Bill of Materials.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
