import React from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { StatsSection } from './StatsSection';
import {
  ShieldCheck,
  Cpu,
  Handshake,
  Users,
  ArrowUpRight,
  Factory,
  Building2,
  Workflow,
  GraduationCap,
  ShoppingBag,
  Hospital,
  Layers,
  Warehouse
} from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onOpenEnquire: () => void;
  onNavigateCareers: () => void;
}

const SECTORS = [
  { title: 'Industrial Structures', icon: Factory },
  { title: 'Commercial Buildings', icon: Building2 },
  { title: 'Conveyor Systems', icon: Workflow },
  { title: 'Schools & Colleges', icon: GraduationCap },
  { title: 'Shopping Malls & Convention Centres', icon: ShoppingBag },
  { title: 'Hospitals and Churches', icon: Hospital },
  { title: 'Plate Work & Duct Work', icon: Layers },
  { title: 'Pre-Engineered Metal Building (PEMB)', icon: Warehouse }
];

const CORE_VALUES = [
  {
    title: 'Make a customer, not a sale',
    desc: 'Our business is built on trust, precision and long-term relationships. We don’t just deliver projects — we deliver peace of mind.',
    icon: Handshake
  },
  {
    title: 'Quality over quantity',
    desc: 'Error-free deliverables and a streamlined, quality-driven process that surpasses expectations every time.',
    icon: ShieldCheck
  },
  {
    title: '3D & BIM across the lifecycle',
    desc: 'Efficient detailing and consultancy for fabrication companies, using advanced 3D and BIM technologies from tender to erection.',
    icon: Cpu
  },
  {
    title: 'Youth with experience',
    desc: 'The fresh energy of proactive youth blended with industry wisdom drives innovative thinking, practical solutions and responsive service.',
    icon: Users
  }
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onOpenEnquire, onNavigateCareers }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="About 3 Axial"
        subtitle="High-quality steel drafting, detailing and estimation services tailored for diverse construction needs across global markets."
        badge="About the Company"
        currentTab="About"
        image="/mission-fabrication.jpg"
        imagePosition="center"
        onNavigateHome={onNavigateHome}
      />

      {/* Profile */}
      <section className="section">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow">Company Profile</span>
            <h2 className="h-section mt-5">Precision, commitment and craftsmanship in every structure we detail.</h2>
          </div>
          <div className="space-y-6 lg:col-span-7 lg:pt-10">
            <p className="text-[19px] leading-[1.65] text-ink">
              At 3 Axial Steel, we specialise in delivering high-quality steel drafting, detailing, and estimation
              services tailored for diverse construction needs across global markets. Backed by years of experience
              and a team of dedicated professionals, we provide solutions that enhance structural integrity, reduce
              fabrication errors, and optimize project timelines.
            </p>
            <p className="lead">
              From 3D tender modeling using Tekla Structures (X-steel) to detailed shop and erection drawings, our
              work reflects precision and compliance with international standards — both imperial and metric.
              Whether it’s miscellaneous steel detailing, joist and deck drawings, or steel connection design, we
              ensure every project is executed with clarity, accuracy, and engineering excellence.
            </p>
            <p className="lead">
              Our team thrives on delivering architectural and structural steel detailing solutions that are not
              only technically sound but also on time and quality-assured. We pride ourselves on being a one-stop
              solution for the construction industry’s steel detailing needs — from concept to construction-ready
              outputs.
            </p>
            <ul className="grid grid-cols-1 gap-px border border-line bg-line pt-0 sm:grid-cols-3">
              {['Tekla Structures (X-steel)', 'Imperial & Metric', 'Concept to construction-ready'].map((t) => (
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

      {/* Success formula */}
      <section className="border-y border-line bg-surface text-ink">
        <div className="container-x grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-3">
            <span className="eyebrow eyebrow-orange">3 Axial Success Formula</span>
          </div>
          <blockquote className="border-l-4 border-accent pl-8 lg:col-span-9">
            <p className="font-display text-[26px] font-medium leading-[1.35] tracking-[-0.02em] sm:text-[34px]">
              “Experience our work firsthand and witness our efficiency in action — we believe every first-time
              customer is a customer for life.”
            </p>
            <footer className="mt-8 max-w-2xl text-[16px] leading-[1.65] text-muted">
              We are shaping the future of business by building strong foundations through smart structural design
              and precise steel detailing.
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Sectors */}
      <section className="section">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">Sectors We Serve</span>
              <h2 className="h-section mt-5">Specialised detailing across a broad spectrum of construction.</h2>
              <p className="lead mt-6 max-w-2xl">
                With proven expertise at 3 Axial, our capabilities span industrial plants, commercial buildings,
                and infrastructure projects — including industrial structures, conveyor systems, educational
                institutions, hospitals, churches, shopping malls, convention centres, parking sheds, storage
                facilities, and precision plate and duct work.
              </p>
            </div>
            <div className="flex items-end lg:col-span-5 lg:justify-end">
              <button onClick={onNavigateCareers} className="btn-primary">
                Join Us
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  className={`group flex items-center gap-4 border-b border-r border-line p-6 transition-colors ${tone(idx).hoverBg}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] ${tone(idx).soft}`}>
                    <Icon className={`h-5 w-5 ${tone(idx).text}`} strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow eyebrow-green">Quality Prioritised</span>
              <h2 className="h-section mt-5">Protection in every detail.</h2>
              <p className="lead mt-6 max-w-2xl">
                A reliable steel detailing service is crucial for the success of any steel construction project. At
                3 Axial Steel, we stand by two core principles: “Make a customer, not a sale” and “Quality over
                quantity.”
              </p>
            </div>
            <div className="flex items-end lg:col-span-5 lg:justify-end">
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
