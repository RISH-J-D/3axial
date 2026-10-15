import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  currentTab: string;
  onNavigateHome: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  currentTab,
  onNavigateHome
}) => {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface text-ink">
      <img
        src="/blueprint-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.07] grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-surface/40" />

      <div className="container-x relative pt-14 pb-16 lg:pt-20 lg:pb-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <button onClick={onNavigateHome} className="transition-colors hover:text-brand">
            Home
          </button>
          <span>/</span>
          <span className="text-accent-dark">{currentTab}</span>
        </nav>

        <div className="mt-12 max-w-4xl lg:mt-16">
          <span className="eyebrow">{badge}</span>
          <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="logo-stripe relative h-1" />
    </section>
  );
};
