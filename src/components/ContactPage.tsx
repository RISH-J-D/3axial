import React from 'react';
import { PageHeader } from './PageHeader';
import { ContactQuoteSection } from './ContactQuoteSection';

interface ContactPageProps {
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome, onShowToast }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Contact us."
        subtitle="Every enquiry is treated with the utmost importance. Our engineering leads cover Eastern, Central, Mountain and Pacific time zones."
        badge="Get in Touch"
        currentTab="Contact"
        image="/blueprint-bg.jpg"
        imagePosition="right center"
        onNavigateHome={onNavigateHome}
      />
      <ContactQuoteSection onShowToast={onShowToast} />
    </div>
  );
};
