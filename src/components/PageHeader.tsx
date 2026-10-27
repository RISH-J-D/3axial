import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  currentTab: string;
  onNavigateHome: () => void;
  image?: string;
  imagePosition?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// The final word of the title is set in the editorial italic.
const splitTitle = (title: string) => {
  const words = title.trim().split(' ');
  if (words.length < 2) return { lead: '', last: title };
  return { lead: words.slice(0, -1).join(' ') + ' ', last: words[words.length - 1] };
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  currentTab,
  onNavigateHome,
  image = '/headers/steel-bim.jpg',
  imagePosition = 'center'
}) => {
  const { lead, last } = splitTitle(title);
  return (
    <section className="grain relative overflow-hidden bg-night text-white">
      {/* Backdrop image sits on the right and dissolves into the navy behind the headline */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          src={image}
          alt=""
          aria-hidden="true"
          style={{ objectPosition: imagePosition }}
          className="h-full w-full object-cover opacity-30 lg:opacity-80"
        />
        <div className="absolute inset-0 bg-night/30 mix-blend-multiply" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-night from-5% via-night/80 via-45% to-night/10 lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30 lg:hidden" />
      <div className="draft-grid absolute inset-0 opacity-80" />

      <div className="container-x relative pt-12 pb-16 lg:pt-16 lg:pb-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
          <button onClick={onNavigateHome} className="transition-colors hover:text-white">
            Home
          </button>
          <span className="h-px w-5 bg-white/25" />
          <span className="text-accent">{currentTab}</span>
        </nav>

        <div className="mt-14 max-w-4xl lg:mt-20">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="eyebrow eyebrow-light">
            {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-[40px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[56px] lg:text-[72px]"
          >
            {lead}
            <em className="text-accent">{last}</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
            className="mt-7 max-w-2xl text-[17px] leading-[1.75] text-white/65"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
      <div className="logo-stripe relative h-1" />
    </section>
  );
};
