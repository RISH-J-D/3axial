import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenEnquire }) => {
  return (
    <footer className="bg-surface text-muted">
      <div className="logo-stripe h-1" />
      {/* CTA band */}
      <div className="border-b border-line">
        <div className="container-x flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow-orange">Start a Project</span>
            <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[44px]">
              Have drawings ready for estimation? Let’s talk scope.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onOpenEnquire} className="btn-accent">
              Request a Quote
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <a href="mailto:info@3axialsteeldetail.com" className="btn-outline-green">
              Email Our Team
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <div className="inline-flex items-center gap-3">
            <img
              src="/uploads/2025/06/3axial-logo.png"
              alt="3 Axial Steel Detailing"
              className="h-9 w-auto"
            />
          </div>
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed">
            3 Axial Steel Detailing Services Pvt. Ltd. delivers AISC and CISC compliant Tekla modelling,
            connection design and fabrication drawings to fabricators and contractors worldwide.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
            AISC Associate Member
          </p>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-brand">Company</h4>
          <ul className="mt-5 space-y-3 text-[14px]">
            {COMPANY_LINKS.map((l) => (
              <li key={l.id}>
                <button onClick={() => setActiveTab(l.id)} className="transition-colors hover:text-brand">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="lg:col-span-3">
          <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-dark">Services</h4>
          <ul className="mt-5 space-y-3 text-[14px]">
            {SERVICES.map((s) => (
              <li key={s}>
                <button onClick={() => setActiveTab('services')} className="text-left transition-colors hover:text-brand">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-green-dark">Office</h4>
          <address className="mt-5 text-[14px] not-italic leading-relaxed">
            17B, 3rd Floor, Tech Mahindra Road
            <br />
            Electronic City Phase 2
            <br />
            Bengaluru 560100, India
          </address>
          <div className="mt-5 space-y-2 text-[14px]">
            <a href="tel:+16506956923" className="block text-ink transition-colors hover:text-brand">
              +1 650 695 6923
            </a>
            <a href="mailto:info@3axialsteeldetail.com" className="block text-ink transition-colors hover:text-brand">
              info@3axialsteeldetail.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 text-[12px] text-ink/60 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} 3 Axial Steel Detailing Services Pvt. Ltd. All rights reserved.</span>
          <span>Expertise · Dedication · Quality · Progression</span>
        </div>
      </div>
    </footer>
  );
};
