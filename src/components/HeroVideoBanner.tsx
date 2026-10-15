import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { tone } from '../theme';

interface HeroVideoBannerProps {
  onOpenEnquire: () => void;
  onExploreProjects: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_STATS = [
  { value: '800+', label: 'Projects delivered' },
  { value: '5+', label: 'Countries served' },
  { value: 'AISC · CISC', label: 'Detailing standards' },
  { value: '24/7', label: 'Dual-shift support' }
];

export const HeroVideoBanner: React.FC<HeroVideoBannerProps> = ({ onOpenEnquire, onExploreProjects }) => {
  return (
    <section className="relative flex min-h-[640px] w-full flex-col overflow-hidden bg-white text-ink lg:min-h-[calc(100vh-116px)] lg:max-h-[860px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/uploads/2025/07/Untitled-1280-x-600-px.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      >
        <source src="/uploads/2025/08/Untitled-1280-x-600-px.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
      
      <div className="container-x relative flex flex-1 flex-col justify-center py-20">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow"
          >
            Structural Steel Detailing · Tekla Structures
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[60px] lg:text-[76px]"
          >
            Precision steel detailing, <span className="text-brand">engineered</span> for{' '}
            <span className="text-accent-dark">fabrication.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            className="mt-7 max-w-xl text-[17px] leading-[1.7] text-muted sm:text-[18px]"
          >
            3D Tekla modelling, connection design, pre-bid estimation and shop-ready drawings for
            fabricators and contractors across North America, Europe and Australia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button onClick={onOpenEnquire} className="btn-accent">
              Request a Quote
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button onClick={onExploreProjects} className="btn-outline bg-white/70">
              View Our Projects
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="logo-stripe relative h-[3px]" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative bg-white"
      >
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`border-line py-6 lg:py-8 ${i % 2 === 1 ? 'border-l pl-6' : ''} ${
                i > 0 ? 'lg:border-l lg:pl-8' : ''
              } ${i >= 2 ? 'border-t lg:border-t-0' : ''}`}
            >
              <div className={`font-display text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px] ${tone(i).text}`}>{s.value}</div>
              <div className="mt-1 text-[13px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
