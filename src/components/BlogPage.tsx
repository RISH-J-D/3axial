import React from 'react';
import { PageHeader } from './PageHeader';
import { BlogSection } from './BlogSection';

interface BlogPageProps {
  onNavigateHome: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Engineering insights."
        subtitle="Perspectives on Tekla modelling workflows, connection design automation, AISC/CISC standards and construction technology."
        badge="Insights"
        currentTab="Insights"
        onNavigateHome={onNavigateHome}
      />
      <BlogSection />
    </div>
  );
};
