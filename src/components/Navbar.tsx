import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Moon, Menu, X, ArrowUpRight, LayoutGrid, Layers } from 'lucide-react';
import { toggleSound, isSoundEnabled, playClickSound } from '../utils/audio';

export type PageId = 'home' | 'about' | 'skills' | 'projects' | 'services' | 'process' | 'testimonials' | 'contact';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  viewMode: 'separate' | 'all';
  onToggleViewMode: () => void;
  onHireClick: () => void;
  onOpenProfile?: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  viewMode,
  onToggleViewMode,
  onHireClick,
  onOpenProfile,
  isDark,
  toggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      playClickSound();
    }
  };

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: PageId) => {
    playClickSound();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 dark:bg-black/90 light:bg-white/95 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-slate-200 py-3 shadow-xl shadow-black/20'
          : 'bg-black/60 dark:bg-black/70 light:bg-white/80 backdrop-blur-sm border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        
        {/* Zone 1: Developer Brand Logo with Ahtasham's photo & profile opener */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Logo Avatar - Clicking opens the Profile & HD Photo Modal */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenProfile) {
                onOpenProfile();
              } else {
                handleNavClick('home');
              }
            }}
            className="relative group cursor-pointer focus:outline-none"
            title="Click to open full profile & HD photo preview"
            aria-label="Open profile modal"
          >
            <div className="glow-rotating-ring w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.45)] group-hover:scale-110 transition-transform duration-300">
              <div className="glow-rotating-inner w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png"
                  alt="Ahtasham Javed"
                  className="w-full h-full object-cover object-top scale-125 translate-y-0.5"
                />
              </div>
            </div>
            {/* Active online pulse dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          </button>

          {/* Logo Brand Typography - Navigates Home / Opens Profile */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              handleNavClick('home');
            }}
            className="flex flex-col text-left group cursor-pointer focus:outline-none"
            title="Ahtasham Javed - Home"
          >
            <span className="font-display tracking-wider font-extrabold text-sm sm:text-base text-white dark:text-white light:text-slate-900 group-hover:text-shimmer transition-all leading-tight">
              AHTASHAM JAVED
            </span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
              <span>3D Architect</span>
              <span className="text-slate-600">·</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onOpenProfile?.();
                }}
                className="text-purple-400 hover:text-purple-300 cursor-pointer underline underline-offset-2"
                title="Open Profile Modal"
              >
                Profile
              </span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line with active indicator) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-600">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 font-medium cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-white/10 dark:bg-white/10 light:bg-slate-200 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-semibold'
                    : 'text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + Controls (View mode switch, Theme, Sound, Mobile Menu) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* View Mode Toggle: Separate Pages vs All-in-One */}
          <button
            onClick={() => {
              playClickSound();
              onToggleViewMode();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-600 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title={viewMode === 'separate' ? 'Switch to Continuous Scroll View' : 'Switch to Separate Pages View'}
          >
            {viewMode === 'separate' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Separate Pages</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden xl:inline">Scroll Stream</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-white/5 transition-colors"
            title={soundOn ? 'Mute audio' : 'Enable audio'}
            aria-label="Toggle audio effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-white/5 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => {
              playClickSound();
              onHireClick();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-6 py-5 mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600/30 text-cyan-300 font-semibold border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <button
              onClick={() => {
                playClickSound();
                onToggleViewMode();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-300 flex items-center gap-2 py-1"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Mode: {viewMode === 'separate' ? 'Separate Pages' : 'Scroll Stream'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
