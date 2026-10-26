import React from 'react';
import { PageHeader } from './PageHeader';
import { CareersSection } from './CareersSection';

interface CareersPageProps {
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigateHome, onShowToast }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Careers at 3 Axial."
        subtitle="Join an engineering team shaping steel structures worldwide through Tekla innovation, BIM automation and connection engineering."
        badge="Join Our Team"
        currentTab="Careers"
        image="/mission-fabrication.jpg"
        imagePosition="right center"
        onNavigateHome={onNavigateHome}
      />
      <CareersSection onShowToast={onShowToast} />
    </div>
  );
};
