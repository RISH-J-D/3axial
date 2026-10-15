import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, X, Maximize2 } from 'lucide-react';
import type { SampleDrawing } from '../types';
import { SAMPLE_DRAWINGS } from '../data/siteData';

type Filter = 'all' | 'shop' | 'ab' | 'structural' | 'misc';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'shop', label: 'Shop Drawings' },
  { id: 'ab', label: 'Anchor Bolt & Embed' },
  { id: 'structural', label: 'Structural Steel' },
  { id: 'misc', label: 'Miscellaneous Steel' }
];

export const SampleDrawingsSection: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeDrawing, setActiveDrawing] = useState<SampleDrawing | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!activeDrawing) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveDrawing(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDrawing]);

  const filteredDrawings = SAMPLE_DRAWINGS.filter((item) => filter === 'all' || item.category === filter);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="flex flex-col gap-6 border-b border-line lg:flex-row lg:items-end lg:justify-between">
          <div className="-mb-px flex gap-7 overflow-x-auto">
            {FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`tab whitespace-nowrap ${filter === cat.id ? 'tab-active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button onClick={handleDownload} className="btn-outline-green btn-sm mb-4 self-start lg:self-auto">
            {downloaded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={1.75} />
                Download started
              </>
            ) : (
              <>
                <Download className="h-4 w-4" strokeWidth={1.75} />
                Sample Package (PDF)
              </>
            )}
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {filteredDrawings.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group text-left"
                onClick={() => setActiveDrawing(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden border border-line bg-surface">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white text-ink opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{item.categoryLabel}</p>
                <h3 className="mt-1.5 text-[15px] font-medium text-ink transition-colors group-hover:text-brand">{item.title}</h3>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {activeDrawing && (
        <div className="modal-backdrop" onClick={() => setActiveDrawing(null)}>
          <div className="modal-panel max-w-5xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={activeDrawing.title}>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{activeDrawing.categoryLabel}</p>
                <h3 className="mt-1 font-display text-[18px] font-semibold text-ink">{activeDrawing.title}</h3>
              </div>
              <button
                onClick={() => setActiveDrawing(null)}
                className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="bg-surface p-4 sm:p-6">
              <img src={activeDrawing.image} alt={activeDrawing.title} className="mx-auto max-h-[72vh] w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
