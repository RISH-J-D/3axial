import React from 'react';

const ITEMS = [
  'AISC 303 & 360',
  'CISC',
  'Eurocode 3',
  'AS 4100',
  'BS 5950',
  'Tekla Structures',
  'SDS2 by ALLPLAN',
  'ADSC Connection Design',
  'Advance Bill of Materials',
  'Joist & Deck',
  'Miscellaneous Steel',
  'Pre-Engineered Buildings'
];

const DOTS = ['bg-logo', 'bg-accent', 'bg-green'];

// Slow credentials ticker: the standards we detail to and the platforms we work in.
export const Marquee: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    className={`marquee relative overflow-hidden border-y ${dark ? 'border-white/10 bg-night text-white/60' : 'border-line bg-white text-muted'}`}
    aria-label="Standards and software"
  >
    <div className="marquee-track flex w-max items-center py-5">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
          {ITEMS.map((item, i) => (
            <li key={item} className="flex items-center gap-8 pr-8 text-[12px] font-medium uppercase tracking-[0.16em] whitespace-nowrap">
              {item}
              <span className={`h-1.5 w-1.5 rotate-45 ${DOTS[i % 3]}`} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
