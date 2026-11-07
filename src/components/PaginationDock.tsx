import React from 'react';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { PageId } from './Navbar';
import { playClickSound } from '../utils/audio';

interface PaginationDockProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onHireClick: () => void;
  isAdmin?: boolean;
}

const allPageSequence: { id: PageId; label: string; number: number; adminOnly?: boolean }[] = [
  { id: 'home', label: 'Home Overview', number: 1 },
  { id: 'about', label: 'About & Journey', number: 2 },
  { id: 'skills', label: 'Technical Arsenal', number: 3 },
  { id: 'projects', label: 'Selected Works', number: 4 },
  { id: 'services', label: 'Services & Scope', number: 5 },
  { id: 'process', label: 'Work Methodology', number: 6 },
  { id: 'testimonials', label: 'Client Reviews', number: 7 },
  { id: 'contact', label: 'Start Project', number: 8 },
  { id: 'inbox', label: 'Client Orders', number: 9, adminOnly: true },
];

export const PaginationDock: React.FC<PaginationDockProps> = ({
  currentPage,
  onNavigate,
  onHireClick,
  isAdmin = false,
}) => {
  const pageSequence = allPageSequence.filter((p) => !p.adminOnly || isAdmin);
  const totalPages = pageSequence.length;
  const currentIndex = pageSequence.findIndex((p) => p.id === currentPage);
  const prevPage = currentIndex > 0 ? pageSequence[currentIndex - 1] : null;
  const nextPage = currentIndex < pageSequence.length - 1 ? pageSequence[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous Page Button */}
        {prevPage ? (
          <button
            onClick={() => {
              playClickSound();
              onNavigate(prevPage.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Previous: {prevPage.label}</span>
          </button>
        ) : (
          <div className="hidden sm:block text-xs font-mono text-slate-500">
            01 / 0{totalPages} · Origin
          </div>
        )}

        {/* Center Progress Pips */}
        <div className="flex items-center gap-2">
          {pageSequence.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => {
                playClickSound();
                onNavigate(page.id);
              }}
              className={`transition-all rounded-full ${
                page.id === currentPage
                  ? 'w-7 h-2 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to ${page.label}`}
              aria-label={`Jump to page ${idx + 1}: ${page.label}`}
            />
          ))}
        </div>

        {/* Next Page Button or Hire Trigger */}
        {nextPage ? (
          <button
            onClick={() => {
              playClickSound();
              onNavigate(nextPage.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/40 transition-all active:scale-95"
          >
            <span>Next: {nextPage.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => {
              playClickSound();
              onHireClick();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg transition-all active:scale-95"
          >
            <span>Ready to collaborate? Hire Me</span>
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
};
