import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  currentTab: string;
  onNavigateHome: () => void;
  image?: string;
  imagePosition?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  currentTab,
  onNavigateHome,
  image = '/headers/steel-bim.jpg',
  imagePosition = 'center'
}) => {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface text-ink">
      {/* Backdrop image sits on the right and fades into the surface behind the headline */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          style={{ objectPosition: imagePosition }}
          className="h-full w-full object-cover opacity-25 lg:opacity-100"
        />
        <div className="absolute inset-0 bg-logo/10 mix-blend-multiply" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-surface from-5% via-surface/75 via-45% to-surface/0 lg:block" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-surface/0 lg:hidden" />

      <div className="container-x relative pt-14 pb-16 lg:pt-20 lg:pb-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted">
          <button onClick={onNavigateHome} className="transition-colors hover:text-brand">
            Home
          </button>
          <span>/</span>
          <span className="text-accent-dark">{currentTab}</span>
        </nav>

        <div className="mt-12 max-w-4xl lg:mt-16">
          <span className="eyebrow">{badge}</span>
          <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[48px] lg:text-[60px]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="logo-stripe relative h-1" />
    </section>
  );
};
