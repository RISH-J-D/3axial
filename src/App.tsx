import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { HomeSection } from './components/HomeSection';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { ProjectsPage } from './components/ProjectsPage';
import { DrawingsPage } from './components/DrawingsPage';
import { TeamPage } from './components/TeamPage';
import { CareersPage } from './components/CareersPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { EnquireModal } from './components/EnquireModal';
import { ToastNotification } from './components/ToastNotification';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isChangingPage, setIsChangingPage] = useState<boolean>(false);
  const [isEnquireOpen, setIsEnquireOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsChangingPage(true);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    setTimeout(() => {
      setIsChangingPage(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* 1. Initial High-Tech Steel Preloader */}
      {isInitialLoading && (
        <Preloader onComplete={() => setIsInitialLoading(false)} />
      )}

      {/* 2. Fast Page Transition Progress Bar */}
      <AnimatePresence>
        {isChangingPage && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-brand z-[99] origin-left"
          />
        )}
      </AnimatePresence>

      {/* 3. Global Top Clock Bar (Scrolls off smoothly) & Brand Navigation Header (Sticks to top on scroll) */}
      <TopBar />
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenEnquire={() => setIsEnquireOpen(true)}
      />

      {/* 4. Page-to-Page View Switching */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'home' && (
              <HomeSection
                onOpenEnquire={() => setIsEnquireOpen(true)}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage
                onNavigateHome={() => handleTabChange('home')}
                onOpenEnquire={() => setIsEnquireOpen(true)}
                onNavigateCareers={() => handleTabChange('careers')}
              />
            )}

            {activeTab === 'services' && (
              <ServicesPage
                onNavigateHome={() => handleTabChange('home')}
                onOpenEnquire={() => setIsEnquireOpen(true)}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsPage
                onNavigateHome={() => handleTabChange('home')}
                onOpenEnquire={() => setIsEnquireOpen(true)}
              />
            )}

            {activeTab === 'drawings' && (
              <DrawingsPage
                onNavigateHome={() => handleTabChange('home')}
              />
            )}

            {activeTab === 'team' && (
              <TeamPage
                onNavigateHome={() => handleTabChange('home')}
              />
            )}

            {activeTab === 'careers' && (
              <CareersPage
                onNavigateHome={() => handleTabChange('home')}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'blog' && (
              <BlogPage
                onNavigateHome={() => handleTabChange('home')}
              />
            )}

            {activeTab === 'contact' && (
              <ContactPage
                onNavigateHome={() => handleTabChange('home')}
                onShowToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Deep Charcoal Navy Corporate Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenEnquire={() => setIsEnquireOpen(true)}
      />

      {/* 6. Global Quote Request Modal */}
      <EnquireModal
        isOpen={isEnquireOpen}
        onClose={() => setIsEnquireOpen(false)}
        onShowToast={showToast}
      />

      {/* 7. Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
