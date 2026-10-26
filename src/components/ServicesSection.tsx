import React from 'react';
import { tone } from '../theme';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';
import { Calculator, Hammer, Layers, Grid3x3, Cpu, Wrench, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onOpenEnquire: () => void;
}

const SERVICES = [
  {
    icon: Calculator,
    title: 'Estimations',
    tag: 'Bidding & Quantities',
    paragraphs: [
      'We prepare 3D tender models in Tekla Structure (X-steel) for steel structures estimation. Through these models we extract different kind of advance Bill Of Material (ABM) reports with useful information of preliminary marks, phases and lLot sequences.',
      'Through Pre-bid Estimation service we provide, steel quantities, detailing time estimate, price estimate with great accuracy in desired format. Our accurate estimation services help our domestic & international clients to bid the project and get it awarded.'
    ]
  },
  {
    icon: Hammer,
    title: 'Structural Steel Detailing',
    tag: 'Core Detailing',
    paragraphs: [
      'We provide structural steel detailing services for all kind of structures in imperial and metric in accordance with AISC, CISC & BS stipulations. 3 Axial offers a complete line of detailing services using Tekla.',
      'We understand and visualize the complexity of projects, specific real time fabrication issues and adapt in detailing of shop &GA drawings to enhance the efficacy of the project managers/fabricators to complete the projects successfully within the schedule.',
      'With 3 Axial, you get more than drawings — you get expert insight, tailored solutions, and detailing that elevates your project’s success.'
    ]
  },
  {
    icon: Layers,
    title: 'Miscellaneous Steel Detailing',
    tag: 'Specialised Metals',
    paragraphs: [
      'We are providing shop drawings and erection drawings for all kind of Miscellaneous. Stair Erection Plan & Elevations with all shop drawings for stairs, Rails, Landing Frames & Its supports Ladder layout with shop drawings for Elevator pit ladder, Roof access ladder & Cage ladders Handrails and Guardrails Layouts with shop drawings Gratings and Floor Plates Layouts with shop drawings.',
      'Bollard shop drawings and Erection drawings Pergola & Trellis Shop drawings and Erection drawing. Sinage board drawings Eco mesh panel shop drawings and Layout. Screen wall roof plan. Mechanical roof screen support Shop and erection drawings for Dumpster gate, Sliding gate & Fence etc… Gate Barrier at stair. Elevator sill angle Trench drains Layout with shop drawings. Loose lintels Layout with shop drawings'
    ]
  },
  {
    icon: Grid3x3,
    title: 'Joist & Deck Detailing',
    tag: 'Joist & Deck Systems',
    paragraphs: [
      'Our Joist and Deck Detailing Services consist of preparing complete and accurate lists and bills for Vulcraft, Canam & New Millenium products as specified in the Structural Design Drawings. These products typically include joist girders, open web joist, bridging, deck, and accessories. Also included are all the erection plans, elevations, sections and details for the proper and safe installation of the joist and deck.',
      'We typically provide these services in coordination with the structural steel detailing as an effective option on time sensitive projects when the supplier’s detailing schedule can not meet the project’s schedule. However, Prism Steel will detail joist and deck under an independent contract. We have also detailed joist and deck direct for both Vulcraft and New Millenium.'
    ]
  },
  {
    icon: Cpu,
    title: 'Connection Design & Stamping',
    tag: 'Engineering & PE Stamp',
    paragraphs: [
      'Steel connection design is one of the most intricate and time-intensive stages in structural steel engineering. This critical phase demands a high level of precision and efficiency, as even minor miscalculations can lead to significant issues in fabrication and construction.',
      'Advance Design Steel Connections (ADSC) is a powerful, user-friendly module that streamlines this process by enabling accurate design and verification of a wide range of steel connections. Widely adopted in the United States and Canada, ADSC ensures compliance with regional standards while significantly reducing the risk of errors and project delays. Its intelligent automation capabilities allow engineers to deliver reliable, code-compliant connections with greater speed and confidence.'
    ]
  },
  {
    icon: Wrench,
    title: 'Research & Development',
    tag: 'BIM Automation',
    paragraphs: [
      'The Research & Development team plays a pivotal role in driving innovation within the steel detailing domain. Focused on enhancing accuracy, speed, and efficiency, the R&D division is dedicated to developing advanced tools, automating repetitive tasks, and refining detailing standards.',
      'By integrating the latest technologies and customizing solutions tailored to project-specific requirements, the team ensures a leading edge in detailing excellence. Whether it’s optimizing Tekla Structures environments, creating smart components, or streamlining BIM workflows, the commitment to continuous improvement delivers tangible value to every project.'
    ]
  }
];

// RGB triplets matching the theme tones (blue, orange, green) for coloured shadows and glows.
const TONE_RGB = ['18,112,249', '244,113,6', '40,164,74'];

interface ServiceCardProps {
  srv: (typeof SERVICES)[number];
  idx: number;
  onOpenEnquire: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ srv, idx, onOpenEnquire }) => {
  const Icon = srv.icon;
  const t = tone(idx);
  const rgb = TONE_RGB[idx % TONE_RGB.length];
  const reduceMotion = useReducedMotion();

  // Pointer position within the card, 0..1 on each axis
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [3.5, -3.5]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-4.5, 4.5]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.75), transparent 45%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      className="[perspective:1600px]"
    >
      <motion.article
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          ['--glow' as string]: rgb
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-gradient-to-b from-white to-surface p-7 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_4px_rgba(20,33,61,0.04),0_18px_40px_-18px_rgba(var(--glow),0.35)] transition-shadow duration-300 hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_8px_rgba(20,33,61,0.05),0_34px_60px_-22px_rgba(var(--glow),0.5)] lg:p-8"
      >
        {/* Top colour bar */}
        <span className={`absolute inset-x-0 top-0 h-[3px] ${t.solid}`} />

        {/* Blueprint grid, fading out towards the bottom */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          style={{
            backgroundImage: `linear-gradient(rgba(${rgb},0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},0.07) 1px, transparent 1px)`,
            backgroundSize: '22px 22px'
          }}
        />

        {/* Oversized outlined index number */}
        <span
          aria-hidden="true"
          style={{ transform: 'translateZ(20px)', WebkitTextStroke: `1.5px rgba(${rgb},0.22)` }}
          className="pointer-events-none absolute -right-2 -top-4 font-display text-[120px] font-bold leading-none tracking-[-0.02em] text-transparent select-none"
        >
          {String(idx + 1).padStart(2, '0')}
        </span>

        {/* Cursor glare */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        <div className="relative flex flex-1 flex-col" style={{ transformStyle: 'preserve-3d' }}>
          {/* Raised icon tile */}
          <div style={{ transform: 'translateZ(50px)' }} className="flex items-center gap-4">
            <span
              style={{ boxShadow: `0 10px 22px -8px rgba(${rgb},0.55), inset 0 1px 0 rgba(255,255,255,0.35)` }}
              className={`relative flex h-14 w-14 items-center justify-center rounded-[12px] ${t.solid} transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-4deg]`}
            >
              <span className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/30 to-transparent" />
              <Icon className="relative h-7 w-7 text-white" strokeWidth={1.6} />
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${t.soft} ${t.text}`}>
              {srv.tag}
            </span>
          </div>

          <h3
            style={{ transform: 'translateZ(36px)' }}
            className="mt-7 font-display text-[23px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
          >
            {srv.title}
          </h3>
          <div style={{ transform: 'translateZ(24px)' }} className="mt-4 space-y-4">
            {srv.paragraphs.map((para, i) => (
              <p key={i} className={`text-[15px] leading-[1.75] ${i === 0 ? 'text-ink/80' : 'text-muted'}`}>
                {para}
              </p>
            ))}
          </div>

          <div style={{ transform: 'translateZ(40px)' }} className="mt-auto pt-7">
            <button onClick={onOpenEnquire} className="link-arrow">
              Request a Quote
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquire }) => {
  return (
    <section className="section relative overflow-hidden bg-white">
      {/* Soft ambient colour behind the cards */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-logo/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/2 h-[380px] w-[380px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-green/10 blur-[120px]" />
      </div>

      <div className="container-x relative">
        <div className="max-w-2xl">
          <span className="eyebrow">Capabilities</span>
          <h2 className="h-section mt-5">End-to-end steel detailing services.</h2>
          <p className="lead mt-5">
            From pre-bid tender models to certified connection design and shop-ready fabrication drawings.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
          {SERVICES.map((srv, idx) => (
            <ServiceCard key={srv.title} srv={srv} idx={idx} onOpenEnquire={onOpenEnquire} />
          ))}
        </div>
      </div>
    </section>
  );
};
