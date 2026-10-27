import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CountUp } from './CountUp';

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

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE }
});

export const HeroVideoBanner: React.FC<HeroVideoBannerProps> = ({ onOpenEnquire, onExploreProjects }) => {
  return (
    <section className="grain relative flex min-h-[680px] w-full flex-col overflow-hidden bg-night text-white lg:h-[calc(100svh-120px)] lg:min-h-[560px] lg:max-h-[980px]">
      <motion.video
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
        autoPlay
        loop
        muted
        playsInline
        poster="/uploads/2025/07/Untitled-1280-x-600-px.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/uploads/2025/08/Untitled-1280-x-600-px.mp4" type="video/mp4" />
      </motion.video>
      {/* Cinematic grading: deep navy from the left, lifted at the bottom for the stat band */}
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/30" />
      <div className="draft-grid absolute inset-0 opacity-70" />

      {/* Drafting-sheet margin lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-5 hidden w-px bg-white/[0.07] sm:left-8 sm:block lg:left-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-5 hidden w-px bg-white/[0.07] sm:right-8 sm:block lg:right-10" />

      <div className="container-x relative flex min-h-0 flex-1 flex-col justify-center py-24 lg:py-[clamp(24px,4vh,64px)]">
        <div className="max-w-4xl">
          <motion.span {...rise(0)} className="eyebrow eyebrow-light">
            Structural Steel Detailing · Est. 2018 · Bengaluru
          </motion.span>

          <motion.h1
            {...rise(0.1)}
            className="mt-8 font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[64px] lg:mt-[clamp(16px,3vh,32px)] lg:text-[clamp(44px,min(5.6vw,8.6vh),84px)]"
          >
            Precision steel detailing,
            <br />
            <em className="text-accent">engineered</em> for fabrication.
          </motion.h1>

          <motion.p {...rise(0.2)} className="mt-8 max-w-xl text-[17px] leading-[1.7] text-white/70 sm:text-[18px] lg:mt-[clamp(16px,3vh,32px)] lg:text-[clamp(15px,2.1vh,18px)]">
            3D Tekla modelling, connection design, pre-bid estimation and shop-ready drawings for
            fabricators and contractors across North America, Europe and Australia.
          </motion.p>

          <motion.div {...rise(0.3)} className="mt-11 flex flex-wrap items-center gap-4 lg:mt-[clamp(20px,4vh,44px)]">
            <button onClick={onOpenEnquire} className="btn-accent">
              Request a Quote
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button onClick={onExploreProjects} className="btn-outline-light">
              View Our Projects
            </button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 right-5 hidden items-center gap-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white/50 sm:right-8 lg:right-10 lg:flex"
          aria-hidden="true"
        >
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-16 w-px overflow-hidden bg-white/15">
            <span className="scroll-cue absolute inset-0 bg-accent" />
          </span>
        </motion.div>
      </div>

      {/* Stat band */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: EASE }}
        className="relative border-t border-white/10 bg-night/55 backdrop-blur-md"
      >
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`border-white/10 py-6 lg:py-[clamp(16px,2.6vh,32px)] ${i % 2 === 1 ? 'border-l pl-6' : ''} ${i > 0 ? 'lg:border-l lg:pl-8' : ''} ${
                i >= 2 ? 'border-t lg:border-t-0' : ''
              }`}
            >
              <div className="font-display text-[26px] font-semibold tracking-[-0.02em] text-white sm:text-[30px] lg:text-[clamp(22px,3.2vh,30px)]">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="logo-stripe relative h-[3px]" />
    </section>
  );
};
