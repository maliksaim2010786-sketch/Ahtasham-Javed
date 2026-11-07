import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Github, MessageCircle, Box, Layers, UserCheck } from 'lucide-react';
import { Hero3D } from './Hero3D';
import { HolographicCard3D } from './HolographicCard3D';
import { playClickSound } from '../utils/audio';
import { PageId } from './Navbar';

interface HeroProps {
  onHireClick: () => void;
  onNavigate?: (page: PageId) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHireClick, onNavigate }) => {
  const [activeVisual, setActiveVisual] = useState<'3d-scene' | '3d-card'>('3d-scene');

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyber Grid Subtle Background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Full-Stack Web Developer</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-purple-400">3D Web Architect</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.1] font-display text-balance">
              Hi, I'm <span className="text-shimmer font-black">Ahtasham Javed</span>.
              <br />
              Crafting Next-Gen 3D Web Experiences.
            </h1>

            {/* Subtitle / Lead Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-2xl leading-relaxed">
              I engineer high-performance web applications, interactive Three.js 3D environments,
              and conversion-driven digital products with international agency-level polish,
              flawless responsiveness, and sub-120ms micro-interaction latency.
            </p>

            {/* Unboxed Metadata / Tech Stack Bar */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono pt-1">
              <span className="text-slate-200 dark:text-slate-200 light:text-slate-700 font-medium">Core Stack:</span>
              <span>React 19</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Three.js / WebGL</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>TypeScript</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Node.js</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Tailwind CSS</span>
            </div>

            {/* Action Buttons & Links */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  playClickSound();
                  if (onNavigate) {
                    onNavigate('projects');
                  } else {
                    const el = document.getElementById('projects');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onHireClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 glass-panel hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </button>

              <a
                href="https://wa.me/923007118380?text=Hi%20Ahtasham,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="p-3.5 rounded-xl glass-panel text-slate-300 hover:text-emerald-400 transition-colors"
                title="Direct WhatsApp Chat (0300-7118380)"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="p-3.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive Profile Viewport */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* 3D Mode Switcher (Both showcase Ahtasham's image in 3D!) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 mb-3 text-xs shadow-lg">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveVisual('3d-scene');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeVisual === '3d-scene'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Three.js 3D World</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveVisual('3d-card');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeVisual === '3d-card'
                    ? 'bg-cyan-600/80 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Holo Card</span>
              </button>
            </div>

            {/* Container for the 3D Experience with spinning colorful border beam */}
            <div className="glow-rotating-ring w-full max-w-[460px] aspect-square rounded-[32px] p-[2.5px] shadow-2xl shadow-purple-950/40">
              <div className="glow-rotating-inner rounded-[30px] w-full h-full relative overflow-hidden bg-black/90 p-1">
                {activeVisual === '3d-scene' ? (
                  <div className="w-full h-full relative rounded-[28px] overflow-hidden">
                    <Hero3D />
                    {/* Floating 3D Badge */}
                    <div className="absolute top-3 left-3 text-[11px] font-mono text-cyan-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 pointer-events-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>THREE.JS 3D AVATAR</span>
                    </div>
                    <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-white/10 pointer-events-none">
                      DRAG TO SPIN 360°
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <HolographicCard3D />
                  </div>
                )}
              </div>
            </div>

            {/* Sub-label explaining interactivity & Solo Clear View */}
            <div className="mt-3 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-medium">Hover over image for Solo Clear View</span>
              <span className="text-slate-600">·</span>
              <span>Drag to spin 360° in 3D</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
