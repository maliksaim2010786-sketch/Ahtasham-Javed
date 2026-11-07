import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { PageId } from './Navbar';
import { playClickSound } from '../utils/audio';

interface FooterProps {
  onNavigate?: (page: PageId) => void;
  onOpenProfile?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProfile }) => {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleLinkClick = (id: PageId) => {
    playClickSound();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-black/90 dark:bg-black/90 light:bg-slate-50 py-12 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Row: Brand & Quick Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onOpenProfile) onOpenProfile();
                  else handleLinkClick('home');
                }}
                className="cursor-pointer group"
                title="Click to open full profile & photo"
                aria-label="Open profile modal"
              >
                <div className="glow-rotating-ring w-10 h-10 rounded-full p-[2px] shadow-[0_0_10px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                  <div className="glow-rotating-inner w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png"
                      alt="Ahtasham Javed"
                      className="w-full h-full object-cover object-top scale-125 translate-y-0.5"
                    />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLinkClick('home')}
                className="flex flex-col text-left cursor-pointer group"
                title="Ahtasham Javed - Home"
              >
                <span className="font-display tracking-wider font-extrabold text-base text-white group-hover:text-cyan-400 transition-colors">
                  AHTASHAM JAVED
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 -mt-0.5">
                  3D WEB ARCHITECT
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Creative Full-Stack Web Developer & 3D Web Architect
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Back To Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors"
            title="Scroll to top of portfolio"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10 light:bg-slate-200" />

        {/* Bottom Row: Copyright, Socials & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Ahtasham Javed. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="hover:text-cyan-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="hover:text-purple-400 transition-colors"
              aria-label="Twitter/X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/923007118380"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="hover:text-emerald-400 transition-colors"
              aria-label="WhatsApp (0300-7118380)"
              title="Chat on WhatsApp: 0300 7118380"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Crafted with React 19, TypeScript & Three.js
          </div>
        </div>

      </div>
    </footer>
  );
};
