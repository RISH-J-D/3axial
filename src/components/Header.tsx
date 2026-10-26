import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnquire: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'drawings', label: 'Sample Drawings' },
  { id: 'team', label: 'Team' },
  { id: 'careers', label: 'Careers' },
  { id: 'blog', label: 'Insights' },
  { id: 'contact', label: 'Contact' }
];

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenEnquire }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        isScrolled ? 'shadow-[0_1px_0_0_var(--color-line),0_8px_24px_-12px_rgba(11,22,38,0.12)]' : 'border-b border-line'
      }`}
    >
      <div className="flex h-[76px] w-full items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <button
          type="button"
          className="flex flex-shrink-0 items-center gap-4"
          onClick={() => go('home')}
          aria-label="3 Axial Steel Detailing — Home"
        >
          <img
            src="/uploads/2025/06/3axial-logo.png"
            alt="3 Axial Steel Detailing"
            className="h-10 w-auto object-contain lg:h-11"
          />
          <span className="hidden h-8 w-px bg-line sm:block" />
          <img
            src="/uploads/2025/07/3axial-Elements.jpg"
            alt="AISC Associate Member"
            className="hidden h-10 w-auto object-contain sm:block"
          />
          <img
            src="/uploads/2025/07/nisd-logo.png"
            alt="NISD — National Institute of Steel Detailing"
            className="hidden h-10 w-auto object-contain sm:block"
          />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden h-full items-stretch gap-7 xl:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`relative flex items-center whitespace-nowrap text-[14px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] bg-accent transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <button onClick={onOpenEnquire} className="btn-accent btn-sm hidden sm:inline-flex">
            Request a Quote
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-line text-ink transition-colors hover:border-brand hover:text-brand xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-line bg-white xl:hidden animate-fadeIn">
          <nav className="container-x py-4" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`flex w-full items-center justify-between border-b border-line py-4 text-left font-display text-[18px] font-medium ${
                  activeTab === item.id ? 'text-brand' : 'text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="grid gap-3 pt-6 sm:grid-cols-2">
              <a href="tel:+16506956923" className="btn-outline">
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                +1 650 695 6923
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquire();
                }}
                className="btn-accent"
              >
                Request a Quote
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
