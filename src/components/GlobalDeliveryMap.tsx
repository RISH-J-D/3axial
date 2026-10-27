import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SiteDef } from './globalMap/WorldScene';

// three.js is only downloaded once the map is about to scroll into view.
const WorldScene = lazy(() => import('./globalMap/WorldScene'));

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

// at: lon/lat where each site's structure stands, set clear of its neighbours; a leader runs back to the city.
const SITES: SiteDef[] = [
  { city: 'Los Angeles', country: 'United States', lon: -118.24, lat: 34.05, at: [-146, 18] },
  { city: 'Denver', country: 'United States', lon: -104.99, lat: 39.74, at: [-128, 64] },
  { city: 'Chicago', country: 'United States', lon: -87.63, lat: 41.88, at: [-97, 66] },
  { city: 'Toronto', country: 'Canada', lon: -79.38, lat: 43.65, at: [-66, 64] },
  { city: 'New York', country: 'United States', lon: -74.0, lat: 40.71, at: [-48, 26] },
  { city: 'London', country: 'United Kingdom', lon: -0.13, lat: 51.5, at: [-18, 64] },
  { city: 'Sydney', country: 'Australia', lon: 151.21, lat: -33.87, at: [165, -15] }
];

const noop = () => {};

export const GlobalDeliveryMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: '600px 0px' });
    const visible = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  return (
    <section className="section overflow-hidden bg-surface lg:flex lg:h-[calc(100svh-76px)] lg:min-h-[640px] lg:flex-col lg:py-10">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.div {...reveal} className="lg:col-span-5">
            <span className="eyebrow eyebrow-orange">Global Delivery</span>
            <h2 className="h-section mt-6 lg:mt-4 lg:text-[44px]">Aligned with your <em className="text-accent-dark">working day.</em></h2>
          </motion.div>
          <motion.p {...reveal} className="lead lg:col-span-6 lg:col-start-7 lg:pt-8">
            Our dual-shift engineering teams overlap with office hours across North America, Europe and
            Australia — so questions are answered and revisions turned around while your team is online.
          </motion.p>
        </div>
      </div>

      <div ref={mapRef} className="mt-10 overflow-x-auto overflow-y-hidden lg:mt-4 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        {/* Fixed height on small screens (scrolls sideways); fills the rest of the viewport on large ones */}
        <div className="relative h-[520px] min-w-[1000px] sm:h-[clamp(520px,44vw,860px)] lg:h-full lg:min-w-0">
          {load ? (
            <Suspense fallback={null}>
              <WorldScene sites={SITES} active={active} onIssue={noop} labels={labelRefs} />
            </Suspense>
          ) : null}
          {/* Positioned every frame by the scene; hidden until first placed */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {SITES.map((s, i) => (
              <div
                key={s.city}
                ref={(el) => void (labelRefs.current[i] = el)}
                className="absolute left-0 top-0 whitespace-nowrap border border-line bg-white/95 px-2.5 py-1.5 text-center opacity-0 shadow-[0_4px_14px_-6px_rgba(20,33,61,0.25)] transition-opacity duration-500"
              >
                <div className="font-display text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink">{s.city}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted">{s.country}</div>
              </div>
            ))}
            <div
              ref={(el) => void (labelRefs.current[SITES.length] = el)}
              className="absolute left-0 top-0 whitespace-nowrap bg-ink px-3.5 py-2 text-left opacity-0 shadow-[0_8px_22px_-8px_rgba(20,33,61,0.55)] transition-opacity duration-500"
            >
              <div className="logo-stripe absolute inset-x-0 top-0 h-[3px]" />
              <div className="text-[11px] uppercase tracking-[0.08em] text-accent">Headquarters</div>
              <div className="mt-0.5 font-display text-[14px] font-semibold leading-tight tracking-[-0.01em] text-white">3 Axial · Bengaluru</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-white/65">India · Engineering hub</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
