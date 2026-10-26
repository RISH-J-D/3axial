import React from 'react';
import { tone } from '../theme';
import { PageHeader } from './PageHeader';
import { TeamSection } from './TeamSection';

interface TeamPageProps {
  onNavigateHome: () => void;
}

const FACTS = [
  { n: '120+', title: 'In-house detailers', desc: 'Tekla-certified structural detailers working in synchronised project teams.' },
  { n: '15+', title: 'Years average experience', desc: 'Senior project managers with deep backgrounds in US and Canadian structural erection.' },
  { n: 'Ongoing', title: 'Skills training', desc: 'Regular training on AISC code revisions, IDEA StatiCa FEA and the Tekla Open API.' }
];

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Leadership and engineering team."
        subtitle="Decades of shop-floor steel fabrication expertise, combined with advanced Tekla 3D modelling and connection design engineering."
        badge="Our People"
        currentTab="Team"
        image="/uploads/2025/07/Untitled-1280-x-600-px.jpg"
        imagePosition="center 30%"
        onNavigateHome={onNavigateHome}
      />

      <TeamSection />

      <section className="bg-surface">
        <div className="container-x grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {FACTS.map((f, i) => (
            <div key={f.title} className="bg-surface py-14 md:px-10 md:first:pl-0">
              <div className={`font-display text-[40px] font-semibold leading-none tracking-[-0.02em] ${tone(i).text}`}>{f.n}</div>
              <h3 className="mt-5 text-[16px] font-medium text-ink">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
