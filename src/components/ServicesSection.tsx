import React from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { Calculator, Hammer, Layers, Cpu, Wrench, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onOpenEnquire: () => void;
}

const SERVICES = [
  {
    icon: Calculator,
    title: 'Pre-Bid Estimation & ABM',
    tag: 'Bidding & Quantities',
    desc: '3D tender models in Tekla Structures, extracting an Advance Bill of Materials with preliminary marks, phases and lot sequences to support winning bids.',
    highlights: ['Steel tonnage and mark lists', 'Detailing time and price estimates', 'Fast turnaround for bid submissions']
  },
  {
    icon: Hammer,
    title: 'Structural Steel Detailing',
    tag: 'Core Detailing',
    desc: 'Complete shop and GA drawings in imperial and metric, following AISC, CISC and BS requirements for seamless fabrication and site erection.',
    highlights: ['AISC and CISC requirements', 'Clash-checked Tekla QA audits', 'Erection drawings and anchor bolt plans']
  },
  {
    icon: Layers,
    title: 'Miscellaneous Steel Detailing',
    tag: 'Specialised Metals',
    desc: 'Shop and erection drawings for stairs, landings, handrails, roof access and cage ladders, gates, trench drains and mechanical roof screens.',
    highlights: ['Stairs and railing layouts', 'Cage and roof access ladders', 'Pergolas, gates and loose lintels']
  },
  {
    icon: Cpu,
    title: 'Connection Design',
    tag: 'Engineering & PE Stamp',
    desc: 'Steel connection engineering verified with ADSC and IDEA StatiCa, with PE-stamped calculations available for US and Canadian compliance.',
    highlights: ['ADSC module verification', 'Shear, moment and bracing joints', 'PE-stamped engineering package']
  },
  {
    icon: Wrench,
    title: 'Research & Development',
    tag: 'BIM Automation',
    desc: 'An in-house R&D division building Tekla Open API plugins, modelling macros and custom components that remove repetitive manual work.',
    highlights: ['Custom Tekla Open API plugins', 'BIM workflow automation', 'Standardised detailing libraries']
  }
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquire }) => {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="eyebrow">Capabilities</span>
          <h2 className="h-section mt-5">End-to-end steel detailing services.</h2>
          <p className="lead mt-5">
            From pre-bid tender models to certified connection design and shop-ready fabrication drawings.
          </p>
        </div>

        <div className="mt-16 border-t-2 border-brand">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.article
                key={srv.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: '-40px' }}
                className="grid grid-cols-1 gap-6 border-b border-line py-10 lg:grid-cols-12 lg:gap-10 lg:py-12"
              >
                <div className="flex items-start gap-5 lg:col-span-4">
                  <span className={`pt-1.5 font-mono text-[12px] font-medium ${tone(idx).text}`}>{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <span className={`flex h-12 w-12 items-center justify-center rounded-[4px] ${tone(idx).soft}`}>
                      <Icon className={`h-6 w-6 ${tone(idx).text}`} strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-4 font-display text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">{srv.title}</h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{srv.tag}</p>
                  </div>
                </div>
                <p className="text-[16px] leading-[1.7] text-muted lg:col-span-4">{srv.desc}</p>
                <div className="flex flex-col justify-between gap-6 lg:col-span-4">
                  <ul className="space-y-2.5">
                    {srv.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-[14px] text-ink">
                        <span className={`mt-[8px] block h-[3px] w-3 flex-shrink-0 ${tone(idx).solid}`} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onOpenEnquire} className="link-arrow self-start">
                    Request a Quote
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
