import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroVideoBanner } from './HeroVideoBanner';
import { PartnersStrip } from './PartnersStrip';
import { tone } from '../theme';
import { CheckCircle2, Layers, ArrowRight, ArrowUpRight, Building2, Factory, Compass, Wrench, Boxes, Download, Phone, Mail } from 'lucide-react';

interface HomeSectionProps {
  onOpenEnquire: () => void;
  onNavigateTab: (tab: string) => void;
}

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

const CLOCKS = [
  { region: 'India', city: 'Bengaluru (HQ)', tz: 'Asia/Kolkata' },
  { region: 'US Eastern', city: 'New York', tz: 'America/New_York' },
  { region: 'US Central', city: 'Chicago', tz: 'America/Chicago' },
  { region: 'US Mountain', city: 'Denver', tz: 'America/Denver' },
  { region: 'US Pacific', city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { region: 'Canada', city: 'Toronto', tz: 'America/Toronto' },
  { region: 'Europe', city: 'London', tz: 'Europe/London' },
  { region: 'Australia', city: 'Sydney', tz: 'Australia/Sydney' }
];

const CORE_SERVICES = [
  {
    title: 'Commercial Buildings',
    icon: Building2,
    desc: 'Precision steel detailing for retail, office and mixed-use buildings — code-compliant, fabrication-ready drawings delivered to tight programmes.'
  },
  {
    title: 'Industrial Buildings',
    icon: Factory,
    desc: 'Structural detailing for factories, warehouses and process plants, with efficient layouts, optimised loads and clear fabrication intent.'
  },
  {
    title: 'Miscellaneous Steel',
    icon: Layers,
    desc: 'Stairs, handrails, canopies, platforms and custom components detailed to integrate seamlessly with the architectural design.'
  },
  {
    title: 'Conveyor Structures',
    icon: Compass,
    desc: 'Conveyor support structures aligned with machinery layouts and stress-bearing requirements for industrial installations.'
  },
  {
    title: 'Pre-Engineered Metal Buildings',
    icon: Boxes,
    desc: 'Accurate PEMB detailing that supports faster erection and fewer on-site modifications, for manufacturers and contractors alike.'
  },
  {
    title: 'Special Metals',
    icon: Wrench,
    desc: 'High-precision detailing in aluminium, stainless steel and other specialty metals for architectural and industrial applications.'
  }
];

const WHY_PILLARS = [
  { title: 'Compliance with global standards', desc: 'AISC, CISC, Eurocode and AS 4100 requirements built into every model and sheet.' },
  { title: 'On-time delivery', desc: 'Milestone-driven schedules with transparent progress reporting at every submission.' },
  { title: 'Transparent collaboration', desc: 'RFIs, revisions and approvals tracked openly with your project managers.' },
  { title: 'Cost-efficient solutions', desc: 'Competitive pricing without compromise on checking or drawing quality.' },
  { title: 'Round-the-clock support', desc: 'Dual shifts aligned with North American and European business hours.' },
  { title: 'Scalable team structure', desc: 'Resourcing that scales from a single misc package to multi-thousand-ton projects.' }
];

const TESTIMONIALS = [
  {
    quote:
      'I’ve had the pleasure of working with 3 Axial, and I can confidently say they are among the best in the detailing industry. Their management is highly professional and truly values their clients. With a strong commitment to quality and integrity, they are fully equipped to handle even the largest steel detailing projects.',
    author: 'Marissa James'
  },
  {
    quote:
      '3 Axial Steel Detailers are one of the best detailing companies I’ve had the opportunity to work with. Their management is highly professional and genuinely values their clients. With a strong focus on quality and integrity, they are well-equipped to handle even the most complex steel detailing projects.',
    author: 'Srinath'
  }
];

export const HomeSection: React.FC<HomeSectionProps> = ({ onOpenEnquire, onNavigateTab }) => {
  const [now, setNow] = useState(() => new Date());
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hour12: true }).format(now);
    } catch {
      return now.toLocaleTimeString();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    link.href = '/uploads/2025/07/3axial-Elements.jpg';
    link.download = '3Axial-Steel-Detailing-Brochure.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white">
      {/* 1. Hero */}
      <HeroVideoBanner onOpenEnquire={onOpenEnquire} onExploreProjects={() => onNavigateTab('projects')} />

      {/* 2. Company introduction */}
      <section className="section">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div {...reveal} className="lg:col-span-5">
            <span className="eyebrow">About 3 Axial</span>
            <h2 className="h-section mt-5">A detailing partner built on shop-floor experience.</h2>
          </motion.div>
          <motion.div {...reveal} className="space-y-6 lg:col-span-7 lg:pt-10">
            <p className="text-[19px] leading-[1.65] text-ink">
              3 Axial is a steel detailing firm headquartered in Bengaluru, delivering reliable, detail-oriented
              engineering to clients around the world. Across more than 800 projects, we have worked in every
              construction segment — industrial, commercial, residential, infrastructure, stadia and power plants.
            </p>
            <p className="lead">
              Founded in 2018 by professionals with hands-on experience in structural and mechanical steel design
              and fabrication, many of our core team began their careers on the shop floor and in the field. That
              practical background, combined with strong engineering acumen, lets us bridge the gap between design
              and execution.
            </p>
            <button onClick={() => onNavigateTab('about')} className="link-arrow mt-2">
              More about the company
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </motion.div>
        </div>

        {/* Key figures */}
        <div className="container-x mt-20">
          <div className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {[
              { n: '6+', l: 'Years in operation' },
              { n: '800+', l: 'Projects delivered' },
              { n: '5+', l: 'Countries served' },
              { n: '20+', l: 'Long-term clients' }
            ].map((s, i) => (
              <motion.div
                key={s.l}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className={`border-line pt-8 pb-2 ${i % 2 === 1 ? 'border-l pl-6' : ''} ${i > 0 ? 'lg:border-l lg:pl-8' : ''} ${
                  i >= 2 ? 'mt-8 border-t lg:mt-0 lg:border-t-0' : ''
                }`}
              >
                <div className={`font-display text-[48px] font-semibold leading-none tracking-[-0.04em] sm:text-[60px] ${tone(i).text}`}>
                  {s.n}
                </div>
                <div className={`mt-4 h-[3px] w-10 ${tone(i).solid}`} />
                <div className="mt-3 text-[14px] text-muted">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sectors / core services */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <motion.div {...reveal} className="max-w-2xl">
              <span className="eyebrow eyebrow-orange">What We Detail</span>
              <h2 className="h-section mt-5">Structural and miscellaneous steel, across every sector.</h2>
            </motion.div>
            <motion.div {...reveal}>
              <button onClick={() => onNavigateTab('services')} className="btn-outline">
                All Services
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </motion.div>
          </div>

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line bg-white md:grid-cols-2 lg:grid-cols-3">
            {CORE_SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <motion.button
                  key={srv.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (idx % 3) * 0.06 }}
                  onClick={onOpenEnquire}
                  className={`group relative flex flex-col border-b border-r border-line p-8 text-left transition-colors lg:p-10 ${tone(idx).hoverBg}`}
                >
                  <span className={`absolute inset-x-0 top-0 h-[3px] ${tone(idx).solid}`} />
                  <div className="flex items-start justify-between">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-[4px] ${tone(idx).soft}`}>
                      <Icon className={`h-7 w-7 ${tone(idx).text}`} strokeWidth={1.5} />
                    </span>
                    <span className={`font-mono text-[12px] font-medium ${tone(idx).text}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-10 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-brand">
                    {srv.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.65] text-muted">
                    {srv.desc}
                  </p>
                  <span className="mt-8 inline-flex h-11 items-center gap-2.5 self-start rounded-[4px] border-2 border-brand/25 bg-white px-5 text-[14px] font-semibold text-brand transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    Discuss a project
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission */}
      <section className="section">
        <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12">
          {[
            {
              label: 'Our Vision',
              img: '/vision-3d.png',
              alt: '3D structural steel model',
              text: 'To be the most trusted and reliable engineering partner, known for precision, commitment and timely delivery — built on strong client relationships and continuous innovation.'
            },
            {
              label: 'Our Mission',
              img: '/mission-fabrication.jpg',
              alt: 'Steel fabrication facility',
              text: 'To deliver unparalleled professional service and exceptional quality. 3 Axial stands for trust and precision, empowering clients through reliable 3D detailing solutions.'
            }
          ].map((card, i) => (
            <motion.article key={card.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img src={card.img} alt={card.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
              </div>
              <span className={`eyebrow mt-8 ${i === 1 ? 'eyebrow-orange' : ''}`}>{card.label}</span>
              <p className="mt-4 font-display text-[24px] font-medium leading-[1.4] tracking-[-0.015em] text-ink sm:text-[26px]">
                {card.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 5. Why 3 Axial */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <motion.div {...reveal} className="lg:col-span-5">
              <span className="eyebrow eyebrow-green">Why 3 Axial</span>
              <h2 className="h-section mt-5">
                Engineered for reliability, speed and precision.
              </h2>
            </motion.div>
            <motion.p {...reveal} className="lead lg:col-span-6 lg:col-start-7 lg:pt-10">
              Fabricators choose us because the drawings arrive on schedule, check cleanly and build without
              surprises on the shop floor. These are the commitments behind that.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {WHY_PILLARS.map((p, idx) => (
              <motion.div
                key={p.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: (idx % 3) * 0.06 }}
                className={`relative bg-white p-8 lg:p-10 border-t-[3px] ${tone(idx).border}`}
              >
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] font-medium ${tone(idx).soft} ${tone(idx).text}`}>{String(idx + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-[20px] font-semibold tracking-[-0.015em] text-ink first-letter:uppercase">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-muted">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Software */}
      <PartnersStrip />

      {/* 7. Time zones */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <motion.div {...reveal} className="lg:col-span-5">
              <span className="eyebrow eyebrow-orange">Global Delivery</span>
              <h2 className="h-section mt-5">Aligned with your working day.</h2>
            </motion.div>
            <motion.p {...reveal} className="lead lg:col-span-6 lg:col-start-7 lg:pt-10">
              Our dual-shift engineering teams overlap with office hours across North America, Europe and
              Australia — so questions are answered and revisions turned around while your team is online.
            </motion.p>
          </div>

          <div className="mt-14 grid grid-cols-2 border-l border-t border-line bg-white md:grid-cols-4">
            {CLOCKS.map((c, i) => (
              <div key={c.tz} className="border-b border-r border-line p-6 lg:p-8">
                <div className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${tone(i).text}`}>
                  <span className={`h-2 w-2 rounded-full ${tone(i).solid}`} />
                  {c.region}
                </div>
                <div className="mt-3 font-display text-[26px] font-semibold tracking-[-0.02em] text-ink tabular-nums sm:text-[30px]">
                  {formatTime(c.tz)}
                </div>
                <div className="mt-1 text-[13px] text-muted">{c.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="section">
        <div className="container-x">
          <motion.div {...reveal} className="max-w-2xl">
            <span className="eyebrow eyebrow-green">Client Perspectives</span>
            <h2 className="h-section mt-5">What our clients say.</h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure key={t.author} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className={`border-t-[3px] pt-10 ${tone(i + 1).border}`}>
                <span className="font-display text-[56px] leading-none text-accent" aria-hidden="true">
                  “
                </span>
                <blockquote className="mt-2 text-[19px] leading-[1.65] text-ink">{t.quote}</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-[16px] font-semibold ${tone(i + 1).soft} ${tone(i + 1).text}`}>
                    {t.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{t.author}</span>
                    <span className="block text-[13px] text-muted">Client</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Enquiry */}
      <section className="border-t border-line bg-surface">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12">
          <div className="py-20 lg:col-span-5 lg:py-28 lg:pr-16">
            <span className="eyebrow eyebrow-orange">Enquire</span>
            <h2 className="h-section mt-5">Tell us about your project.</h2>
            <p className="lead mt-6">
              Speak directly with our senior detailing managers about scope, a pre-bid estimate or AISC connection
              requirements. We respond within two to four business hours.
            </p>

            <div className="mt-10 space-y-5 border-t border-line pt-8 text-[15px]">
              <a href="tel:+16506956923" className="flex items-center gap-4 text-ink transition-colors hover:text-brand">
                <Phone className="h-5 w-5 text-accent-dark" strokeWidth={1.5} />
                +1 650 695 6923
              </a>
              <a href="mailto:info@3axialsteeldetail.com" className="flex items-center gap-4 text-ink transition-colors hover:text-brand">
                <Mail className="h-5 w-5 text-green-dark" strokeWidth={1.5} />
                info@3axialsteeldetail.com
              </a>
            </div>

            <button onClick={handleDownloadBrochure} className="btn-outline-green mt-10">
              <Download className="h-4 w-4" strokeWidth={1.75} />
              Download Company Brochure
            </button>
          </div>

          <div className="bg-white px-6 py-12 sm:px-10 lg:col-span-7 lg:px-14 lg:py-20">
            {formSubmitted ? (
              <div className="flex h-full flex-col items-start justify-center py-12">
                <CheckCircle2 className="h-10 w-10 text-brand" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-[28px] font-semibold tracking-[-0.02em]">Thank you.</h3>
                <p className="lead mt-3 max-w-md">Your enquiry has been received. A member of our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="home-name">Full name</label>
                  <input
                    id="home-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="home-email">Work email</label>
                  <input
                    id="home-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="home-phone">Phone</label>
                  <input
                    id="home-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="home-msg">Project scope</label>
                  <textarea
                    id="home-msg"
                    required
                    rows={5}
                    placeholder="Project type, approximate tonnage, timeline and detailing requirements"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="field"
                  />
                </div>
                <div className="flex flex-col items-start justify-between gap-4 sm:col-span-2 sm:flex-row sm:items-center">
                  <p className="text-[13px] text-muted">We respond within 2–4 business hours.</p>
                  <button type="submit" className="btn-green">
                    Submit Enquiry
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
