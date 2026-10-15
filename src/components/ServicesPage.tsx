import React from 'react';
import { tone } from '../theme';
import { PageHeader } from './PageHeader';
import { ServicesSection } from './ServicesSection';
import { ContactQuoteSection } from './ContactQuoteSection';
import { ArrowRight } from 'lucide-react';

interface ServicesPageProps {
  onNavigateHome: () => void;
  onOpenEnquire: () => void;
  onShowToast: (msg: string) => void;
}

const CODE_STANDARDS = [
  { code: 'AISC 360-16', region: 'United States', desc: 'Specification for Structural Steel Buildings (LRFD and ASD).' },
  { code: 'AISC 341-16', region: 'United States — Seismic', desc: 'Seismic provisions for high-risk earthquake and wind loading zones.' },
  { code: 'CSA S16', region: 'Canada', desc: 'Design of Steel Structures, per the Canadian Institute of Steel Construction.' },
  { code: 'BS EN 1993', region: 'Europe / United Kingdom', desc: 'Eurocode 3 — design of steel structures for commercial and industrial assets.' },
  { code: 'AS 4100', region: 'Australia / New Zealand', desc: 'Steel structures code covering high-tensile bolting and member connections.' }
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigateHome, onOpenEnquire, onShowToast }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Steel detailing and engineering services."
        subtitle="From preliminary Tekla tender estimates and Advance Bill of Materials to PE-stamped connection design and shop-ready erection drawings."
        badge="Services"
        currentTab="Services"
        onNavigateHome={onNavigateHome}
      />

      <ServicesSection onOpenEnquire={onOpenEnquire} />

      {/* Design codes */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow eyebrow-green">Design Codes</span>
              <h2 className="h-section mt-5">Global structural code compliance.</h2>
            </div>
            <button onClick={onOpenEnquire} className="btn-outline-accent self-start lg:self-auto">
              Consult an Engineering Lead
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] border-t-2 border-brand text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-6 font-medium">Standard</th>
                  <th className="py-4 pr-6 font-medium">Region</th>
                  <th className="py-4 font-medium">Scope</th>
                </tr>
              </thead>
              <tbody>
                {CODE_STANDARDS.map((item, i) => (
                  <tr key={item.code} className="border-b border-line">
                    <td className="py-6 pr-6 whitespace-nowrap"><span className={`inline-flex items-center gap-3 font-display text-[18px] font-semibold tracking-[-0.01em] ${tone(i).text}`}><span className={`h-2.5 w-2.5 rounded-full ${tone(i).solid}`} />{item.code}</span></td>
                    <td className="py-6 pr-6 text-[15px] text-ink">{item.region}</td>
                    <td className="py-6 text-[15px] leading-relaxed text-muted">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ContactQuoteSection onShowToast={onShowToast} />
    </div>
  );
};
