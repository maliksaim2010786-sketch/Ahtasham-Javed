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
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { HireModal } from './components/HireModal';
import { PaginationDock } from './components/PaginationDock';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [viewMode, setViewMode] = useState<'separate' | 'all'>('separate');
  const [isDark, setIsDark] = useState(true);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedServiceForHire, setSelectedServiceForHire] = useState('Full-Stack Web Development');

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
    const validPages: PageId[] = ['home', 'about', 'skills', 'projects', 'services', 'process', 'testimonials', 'contact'];
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        isDark={isDark}
        toggleTheme={toggleTheme}
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
                />
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
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Hire Me Interactive Modal */}
      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        defaultService={selectedServiceForHire}
      />
    </div>
  );
}
