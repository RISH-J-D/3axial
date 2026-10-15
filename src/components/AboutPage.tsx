import React from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { StatsSection } from './StatsSection';
import { ShieldCheck, Cpu, Globe2, Sparkles, ArrowUpRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onOpenEnquire: () => void;
}

const CORE_VALUES = [
  {
    title: 'AISC & CISC compliance',
    desc: 'Shop drawings and connection details adhere to AISC 360-16, AISC 341 seismic provisions and Canadian CISC S16 standards.',
    icon: ShieldCheck
  },
  {
    title: 'Tekla Structures expertise',
    desc: 'Clash-free 3D models generating CNC files, bolt lists and material call-outs with dimensional accuracy in imperial and metric.',
    icon: Cpu
  },
  {
    title: 'Dual-shift responsiveness',
    desc: 'Engineering shifts aligned with US Eastern, Central, Mountain and Pacific business hours for same-day turnaround.',
    icon: Globe2
  },
  {
    title: 'In-house R&D',
    desc: 'A dedicated team building Tekla Open API plugins to automate repetitive detailing and eliminate drafting errors.',
    icon: Sparkles
  }
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onOpenEnquire }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Engineering precision in every detail."
        subtitle="3 Axial Steel Detailing Services Pvt. Ltd. delivers 3D Tekla modelling, connection engineering and fabrication drawings for North American and international construction projects."
        badge="About the Company"
        currentTab="About"
        onNavigateHome={onNavigateHome}
      />

      {/* Profile */}
      <section className="section">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow">Company Profile</span>
            <h2 className="h-section mt-5">Delivering excellence to US and international fabricators.</h2>
          </div>
          <div className="space-y-6 lg:col-span-7 lg:pt-10">
            <p className="text-[19px] leading-[1.65] text-ink">
              Headquartered in Electronic City, Bengaluru, 3 Axial specialises in 3D Tekla steel modelling,
              connection design, pre-bid estimation and shop drawing production.
            </p>
            <p className="lead">
              Our structural detailers, connection engineers and BIM specialists serve steel fabricators, general
              contractors and structural engineers across the United States, Canada, Europe and Asia.
            </p>
            <ul className="grid grid-cols-1 gap-px border border-line bg-line pt-0 sm:grid-cols-3">
              {['AISC Associate Member', 'ADSC connection design', '800+ completed projects'].map((t) => (
                <li key={t} className="bg-white px-5 py-4 text-[14px] font-medium text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-x mt-20">
          <StatsSection />
        </div>
      </section>

      {/* Quality statement */}
      <section className="border-y border-line bg-surface text-ink">
        <div className="container-x grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-3">
            <span className="eyebrow eyebrow-orange">Quality Commitment</span>
          </div>
          <blockquote className="border-l-4 border-accent pl-8 lg:col-span-9">
            <p className="font-display text-[26px] font-medium leading-[1.35] tracking-[-0.02em] sm:text-[34px]">
              “We believe that a competitive quote makes our clients competitive too. Every assembly drawing passes
              a rigorous three-tier check before issue, so nothing has to be re-fabricated on the shop floor.”
            </p>
            <footer className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
              Tekla environment — Imperial (US) & Metric
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="eyebrow eyebrow-green">Why Fabricators Partner With Us</span>
              <h2 className="h-section mt-5">The standards behind every sheet we issue.</h2>
            </div>
            <div className="flex items-end lg:col-span-6 lg:justify-end">
              <button onClick={onOpenEnquire} className="btn-accent">
                Request a Quote
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line bg-white md:grid-cols-2">
            {CORE_VALUES.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  viewport={{ once: true }}
                  className="relative border-b border-r border-line p-8 lg:p-10"
                >
                  <span className={`absolute inset-x-0 top-0 h-[3px] ${tone(idx).solid}`} />
                  <span className={`flex h-14 w-14 items-center justify-center rounded-[4px] ${tone(idx).soft}`}>
                    <Icon className={`h-7 w-7 ${tone(idx).text}`} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-8 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">{v.title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-[1.65] text-muted">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
