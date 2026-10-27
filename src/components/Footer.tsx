import React from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenEnquire: () => void;
}

const COMPANY_LINKS = [
  { id: 'about', label: 'About the Company' },
  { id: 'team', label: 'Leadership' },
  { id: 'projects', label: 'Projects' },
  { id: 'drawings', label: 'Sample Drawings' },
  { id: 'careers', label: 'Careers' },
  { id: 'blog', label: 'Insights' }
];

const SERVICES = [
  'Pre-Bid Estimation & ABM',
  'Structural Steel Detailing',
  'Miscellaneous Steel Detailing',
  'Connection Design',
  'Joist & Deck Placement',
  'BIM Automation (R&D)'
];

const heading = 'text-[11px] font-semibold uppercase tracking-[0.18em]';

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenEnquire }) => {
  return (
    <footer className="grain relative overflow-hidden bg-night text-white/60">
      <div className="logo-stripe h-1" />
      <div className="draft-grid absolute inset-0" />

      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-10 py-20 lg:flex-row lg:items-end lg:py-24">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow-light">Start a Project</span>
            <h2 className="mt-6 font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-[50px]">
              Have drawings ready for estimation? <em className="text-accent">Let’s talk scope.</em>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onOpenEnquire} className="btn-accent">
              Request a Quote
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <a href="mailto:info@3axialsteeldetail.com" className="btn-outline-light">
              Email Our Team
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        {/* Brand */}
        <div className="lg:col-span-4">
          <img src="/uploads/2025/06/3axial-logo.png" alt="3 Axial Steel Detailing" className="h-10 w-auto rounded-[2px] bg-white p-1.5" />
          <p className="mt-7 max-w-sm text-[14px] leading-[1.75]">
            3 Axial Steel Detailing Services Pvt. Ltd. delivers AISC and CISC compliant Tekla modelling,
            connection design and fabrication drawings to fabricators and contractors worldwide.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <img src="/uploads/2025/07/3axial-Elements.jpg" alt="AISC Associate Member" className="h-10 w-auto rounded-[2px] bg-white p-1" />
            <img src="/uploads/2025/07/nisd-logo.png" alt="NISD" className="h-10 w-auto rounded-[2px] bg-white p-1" />
            <span className="ml-2 text-[11px] uppercase tracking-[0.16em] text-white/40">Accredited</span>
          </div>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <h4 className={`${heading} text-logo`}>Company</h4>
          <ul className="mt-6 space-y-3 text-[14px]">
            {COMPANY_LINKS.map((l) => (
              <li key={l.id}>
                <button onClick={() => setActiveTab(l.id)} className="transition-colors hover:text-white">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="lg:col-span-3">
          <h4 className={`${heading} text-accent`}>Services</h4>
          <ul className="mt-6 space-y-3 text-[14px]">
            {SERVICES.map((s) => (
              <li key={s}>
                <button onClick={() => setActiveTab('services')} className="text-left transition-colors hover:text-white">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h4 className={`${heading} text-green`}>Office</h4>
          <address className="mt-6 text-[14px] not-italic leading-[1.75]">
            17B, 3rd Floor, Tech Mahindra Road
            <br />
            Electronic City Phase 2
            <br />
            Bengaluru 560100, India
          </address>
          <div className="mt-6 space-y-2 text-[14px]">
            <a href="tel:+16506956923" className="block text-white transition-colors hover:text-accent">
              +1 650 695 6923
            </a>
            <a href="mailto:info@3axialsteeldetail.com" className="block text-white transition-colors hover:text-accent">
              info@3axialsteeldetail.com
            </a>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <div className="container-x">
          <div className="-mb-[0.26em] font-display text-[22vw] font-bold leading-none tracking-[-0.05em] text-white/[0.035] lg:text-[17vw]">
            3 Axial
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-[12px] text-white/40 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} 3 Axial Steel Detailing Services Pvt. Ltd. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span className="hidden tracking-[0.08em] sm:block">Expertise · Dedication · Quality · Progression</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-white hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
