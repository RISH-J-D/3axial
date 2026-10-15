import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/siteData';

type Filter = 'all' | 'completed' | 'ongoing' | 'commercial' | 'industrial' | 'educational';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'educational', label: 'Educational' },
  { id: 'completed', label: 'Completed' },
  { id: 'ongoing', label: 'Ongoing' }
];

interface ProjectsGalleryProps {
  onOpenEnquire?: () => void;
}

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ onOpenEnquire }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightbox, setActiveLightbox] = useState<Project | null>(null);

  useEffect(() => {
    if (!activeLightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeLightbox]);

  const q = searchQuery.toLowerCase();
  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    const matchesFilter = filter === 'all' || proj.category === filter || proj.sector === filter;
    const matchesSearch =
      proj.title.toLowerCase().includes(q) ||
      (proj.location?.toLowerCase().includes(q) ?? false) ||
      (proj.tonnage?.toLowerCase().includes(q) ?? false);
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="section bg-white">
      <div className="container-x">
        {/* Controls */}
        <div className="flex flex-col gap-6 border-b border-line lg:flex-row lg:items-end lg:justify-between">
          <div className="-mb-px flex gap-7 overflow-x-auto">
            {FILTERS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`tab whitespace-nowrap ${filter === tab.id ? 'tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative mb-4 w-full lg:w-72">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search by name, location or tonnage"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-2 pl-7 text-[14px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
        </p>

        {/* Grid */}
        <motion.div layout className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((proj) => (
              <motion.button
                key={proj.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group text-left"
                onClick={() => setActiveLightbox(proj)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {proj.category === 'ongoing' && (
                    <span className="absolute left-4 top-4 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                      Ongoing
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink transition-colors group-hover:text-brand">
                      {proj.title}
                    </h3>
                    <p className="mt-2 text-[14px] text-muted">
                      <span className="capitalize">{proj.sector}</span>
                      {proj.location && <> · {proj.location}</>}
                      {proj.tonnage && <> · {proj.tonnage}</>}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" strokeWidth={1.5} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="py-20 text-center text-[15px] text-muted">No projects match your search.</p>
        )}

        {onOpenEnquire && (
          <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t-2 border-brand pt-10 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">Have a similar project?</h3>
              <p className="mt-2 text-[15px] text-muted">
                Send us your structural drawings — preliminary tender models and ABM lists in 24 to 48 hours.
              </p>
            </div>
            <button onClick={onOpenEnquire} className="btn-accent">
              Request a Bid Estimate
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activeLightbox && (
        <div className="modal-backdrop" onClick={() => setActiveLightbox(null)}>
          <div className="modal-panel max-w-5xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={activeLightbox.title}>
            <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-5">
              <div className="bg-surface lg:col-span-3">
                <img src={activeLightbox.image} alt={activeLightbox.title} className="h-full max-h-[70vh] w-full object-cover" />
              </div>
              <div className="relative flex flex-col p-8 lg:col-span-2 lg:p-10">
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <span className="eyebrow capitalize">{activeLightbox.sector}</span>
                <h3 className="mt-4 pr-8 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
                  {activeLightbox.title}
                </h3>
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
                <p className="mt-6 text-[15px] leading-[1.7] text-muted">
                  {activeLightbox.description} Detailed to AISC / CISC specifications with Tekla Structures 3D modelling,
                  complete shop drawings, anchor bolt plans and an Advance Bill of Materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
