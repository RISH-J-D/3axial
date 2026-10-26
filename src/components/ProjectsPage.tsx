import React from 'react';
import { PageHeader } from './PageHeader';
import { ProjectsGallery } from './ProjectsGallery';

interface ProjectsPageProps {
  onNavigateHome: () => void;
  onOpenEnquire: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigateHome, onOpenEnquire }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Selected structural steel projects."
        subtitle="More than 800 structural and miscellaneous steel detailing projects delivered across the United States, Canada, Europe and Asia."
        badge="Portfolio"
        currentTab="Projects"
        image="/blueprint-bg.jpg"
        imagePosition="center"
        onNavigateHome={onNavigateHome}
      />
      <ProjectsGallery onOpenEnquire={onOpenEnquire} />
    </div>
  );
};
