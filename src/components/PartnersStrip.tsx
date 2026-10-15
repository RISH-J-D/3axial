import React from 'react';

const PARTNERS = [
  { id: 'tekla', name: 'Tekla Structures', logoSrc: '/partners/tekla.png' },
  { id: 'sds2', name: 'SDS2 by ALLPLAN', logoSrc: '/partners/sds2.png' },
  { id: 'autocad', name: 'Autodesk AutoCAD', logoSrc: '/partners/autocad.png' },
  { id: 'bluebeam', name: 'Bluebeam Revu', logoSrc: '/partners/bluebeam.png' }
];

export const PartnersStrip: React.FC = () => {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-x grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <span className="eyebrow eyebrow-green">Licensed Software</span>
          <h2 className="mt-4 font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[30px]">
            Working natively in the platforms your team already uses.
          </h2>
        </div>
        <div className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-4 lg:col-span-8">
          {PARTNERS.map((p) => (
            <div
              key={p.id}
              className="flex h-28 items-center justify-center border-b border-r border-line px-6 sm:h-32"
              title={p.name}
            >
              <img
                src={p.logoSrc}
                alt={p.name}
                className="max-h-10 w-auto max-w-full object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
