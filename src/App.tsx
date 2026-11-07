/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, PageId } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricStrip } from './components/MetricStrip';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { Achievements } from './components/Achievements';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Inbox } from './components/Inbox';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { HireModal } from './components/HireModal';
import { ProfileModal } from './components/ProfileModal';
import { PaginationDock } from './components/PaginationDock';
import { AuthGateway, AuthSession } from './components/AuthGateway';
import { Lock } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [viewMode, setViewMode] = useState<'separate' | 'all'>('separate');
  const [isDark, setIsDark] = useState(true);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedServiceForHire, setSelectedServiceForHire] = useState('Full-Stack Web Development');

  // Auth Session State (Remembered in browser)
  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    try {
      const stored = localStorage.getItem('ahtasham_portfolio_auth_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: false,
      email: '',
      role: 'guest',
    };
  });

  // Website open hone se pehle login / signin page aana chahiye
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ahtasham_portfolio_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) return false;
      }
    } catch {
      // ignore
    }
    return true; // Show initial login gate
  });

  // Strict check: Only malikahtashamjaved@gmail.com with admin role has owner privileges
  const isAdmin = 
    authSession.isAuthenticated && 
    authSession.email.trim().toLowerCase() === 'malikahtashamjaved@gmail.com' && 
    authSession.role === 'admin';

  const handleAuthSuccess = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem('ahtasham_portfolio_auth_session', JSON.stringify(session));
    } catch {
      // ignore
    }
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    const guestSession: AuthSession = {
      isAuthenticated: false,
      email: '',
      role: 'guest',
    };
    setAuthSession(guestSession);
    try {
      localStorage.removeItem('ahtasham_portfolio_auth_session');
    } catch {
      // ignore
    }
    if (activePage === 'inbox') {
      setActivePage('home');
      window.location.hash = 'home';
    }
    setAuthModalOpen(true);
  };

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Read initial hash on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as PageId;
    const validPages: PageId[] = ['home', 'about', 'skills', 'projects', 'services', 'process', 'testimonials', 'contact', 'inbox'];
    if (validPages.includes(hash)) {
      setActivePage(hash);
    }

    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '') as PageId;
      if (validPages.includes(h)) {
        setActivePage(h);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const el = document.getElementById(page);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 30);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'separate' ? 'all' : 'separate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHire = (service?: string) => {
    if (service) {
      setSelectedServiceForHire(service);
    }
    setHireModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050508] dark:bg-[#050508] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors duration-300 font-sans relative selection:bg-purple-600 selection:text-white flex flex-col justify-between">
      {/* Custom Magnetic Trailing Cursor */}
      <CustomCursor />

      {/* Top Bar Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        onHireClick={() => handleOpenHire()}
        onOpenProfile={() => setProfileModalOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        userEmail={authSession.email}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full pt-16">
        {viewMode === 'separate' ? (
          /* =========================================================================
             SEPARATE PAGES MODE (As requested: Home alag, About alag, Projects alag...)
             ========================================================================= */
          <div className="w-full animate-in fade-in duration-200">
            {activePage === 'home' && (
              <div>
                <Hero
                  onHireClick={() => handleOpenHire()}
                  onNavigate={handleNavigate}
                />
                <MetricStrip />
                <PaginationDock
                  currentPage="home"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'about' && (
              <div className="pt-4">
                <About />
                <PaginationDock
                  currentPage="about"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'skills' && (
              <div className="pt-4">
                <Skills />
                <PaginationDock
                  currentPage="skills"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'projects' && (
              <div className="pt-4">
                <Projects />
                <PaginationDock
                  currentPage="projects"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'services' && (
              <div className="pt-4">
                <Services onSelectService={(s) => handleOpenHire(s)} />
                <PaginationDock
                  currentPage="services"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'process' && (
              <div className="pt-4 space-y-6">
                <Process />
                <Achievements />
                <PaginationDock
                  currentPage="process"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'testimonials' && (
              <div className="pt-4">
                <Testimonials />
                <PaginationDock
                  currentPage="testimonials"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'contact' && (
              <div className="pt-4">
                <Contact initialService={selectedServiceForHire} />
                <PaginationDock
                  currentPage="contact"
                  onNavigate={handleNavigate}
                  onHireClick={() => handleOpenHire()}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {activePage === 'inbox' && (
              <div className="pt-4">
                {isAdmin ? (
                  <>
                    <Inbox />
                    <PaginationDock
                      currentPage="inbox"
                      onNavigate={handleNavigate}
                      onHireClick={() => handleOpenHire()}
                      isAdmin={isAdmin}
                    />
                  </>
                ) : (
                  <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
                    <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-purple-500/30 bg-purple-950/20 shadow-2xl space-y-5 animate-in fade-in duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <Lock className="w-8 h-8 text-cyan-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                          Owner Protected Portal
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                          Access Restricted
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        The Client Orders & Inquiries Hub contains confidential client project orders and is exclusively restricted to authorized owner credentials.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                        <button
                          onClick={() => setAuthModalOpen(true)}
                          className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Sign In with Owner Credentials
                        </button>
                        <button
                          onClick={() => handleNavigate('home')}
                          className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          Return to Home
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             CONTINUOUS STREAM MODE (All sections stacked if user toggles mode)
             ========================================================================= */
          <div className="w-full space-y-8 animate-in fade-in duration-200">
            <Hero
              onHireClick={() => handleOpenHire()}
              onNavigate={handleNavigate}
            />
            <MetricStrip />
            <About />
            <Skills />
            <Projects />
            <Services onSelectService={(s) => handleOpenHire(s)} />
            <Process />
            <Achievements />
            <Testimonials />
            <Contact initialService={selectedServiceForHire} />
            {isAdmin && <Inbox />}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Hire Me Interactive Modal */}
      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        defaultService={selectedServiceForHire}
      />

      {/* Profile & HD Photo Lightbox Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onNavigateHome={() => handleNavigate('home')}
        onHireClick={() => handleOpenHire()}
        onViewProjects={() => handleNavigate('projects')}
      />

      {/* Login / Authentication Gateway */}
      <AuthGateway
        isOpen={authModalOpen}
        onSuccess={handleAuthSuccess}
        onCancel={() => setAuthModalOpen(false)}
        isInitialGate={!authSession.isAuthenticated}
      />
    </div>
  );
}
