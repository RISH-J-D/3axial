import React from 'react';
import { tone } from '../theme';
import { PageHeader } from './PageHeader';
import { SampleDrawingsSection } from './SampleDrawingsSection';

interface DrawingsPageProps {
  onNavigateHome: () => void;
}

const QUALITY_NOTES = [
  {
    title: 'Three-tier quality control',
    desc: 'Every sheet is reviewed by a senior checker, the project manager and a PE engineer before issue.'
  },
  {
    title: 'CNC and KSS output',
    desc: 'DXF, NC1, DSTV and KSS files formatted for direct loading into automated beam lines and plasma cutters.'
  },
  {
    title: 'Your title block',
    desc: 'Sheets customised with your company title block, border, project numbering and logo.'
  }
];

export const DrawingsPage: React.FC<DrawingsPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Sample shop drawings and erection plans."
        subtitle="Review sample sheets for anchor bolt plans, embed layouts, structural steel assemblies and miscellaneous metal details."
        badge="Drawing Quality"
        currentTab="Sample Drawings"
        image="/headers/steel-bim.jpg"
        imagePosition="center 60%"
        onNavigateHome={onNavigateHome}
      />

      <SampleDrawingsSection />

      <section className="bg-surface">
        <div className="container-x grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {QUALITY_NOTES.map((n, i) => (
            <div key={n.title} className="bg-surface py-14 md:px-10 md:first:pl-0">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-medium ${tone(i).soft} ${tone(i).text}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-5 font-display text-[20px] font-semibold tracking-[-0.015em] text-ink">{n.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{n.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
