import React from 'react';
import { Code2, Compass, Layers, Zap, Target, Rocket } from 'lucide-react';
import { HolographicCard3D } from './HolographicCard3D';
import { GlowIconBox } from './GlowIconBox';
import { playHoverSound } from '../utils/audio';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            About The Developer
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display text-balance">
            Building the next generation of interactive web experiences.
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base leading-relaxed">
            A developer who treats web applications as living digital canvases—combining mathematical precision, modern full-stack architectures, and immersive 3D graphics.
          </p>
        </div>

        {/* Top Grid: Journey + 3D Holographic Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* Main Journey Narrative (Span 7) */}
          <div
            onMouseEnter={() => playHoverSound()}
            className="lg:col-span-7 glass-panel rounded-3xl p-8 space-y-6 flex flex-col justify-between border border-white/10 dark:border-white/10 light:border-slate-200"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                <Compass className="w-4 h-4" />
                <span>My Journey & Engineering Ethos</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                From curiosity to crafting bespoke international-grade web platforms.
              </h3>
              <div className="space-y-3.5 text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                <p>
                  I began web development with a simple conviction: modern websites shouldn't be static brochures. They should be tactile, dynamic, and memorable journeys that captivate users from the very first frame.
                </p>
                <p>
                  Over the years, I honed my craft around the modern JavaScript and React ecosystems, mastering TypeScript, component performance, and state management. When I discovered the potential of WebGL and Three.js, it opened a new dimension: bringing cinematic, real-time 3D geometry into production web browsers without sacrificing 60fps responsiveness.
                </p>
                <p>
                  Today, I collaborate with founders, creative studios, and innovative brands to architect bespoke web applications—from luxury car rental platforms like Prime Drive to enterprise AI portals like Stratech.
                </p>
              </div>
            </div>

            {/* Quick Milestones Checklist */}
            <div className="pt-4 border-t border-white/10 light:border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Focus:</span>
                <span className="font-semibold text-white dark:text-white light:text-slate-800">
                  Full-Stack 3D & Creative Frontend
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Location & Availability:</span>
                <span className="font-semibold text-cyan-400">
                  Available for Global Remote Projects
                </span>
              </div>
            </div>
          </div>

          {/* 3D Interactive Holographic Portrait Card (Span 5) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HolographicCard3D />
          </div>

        </div>

        {/* Vision & Goals Banner */}
        <div
          onMouseEnter={() => playHoverSound()}
          className="glass-panel rounded-3xl p-8 mb-8 border border-white/10 dark:border-white/10 light:border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Target className="w-4 h-4" />
              <span>Future Goals & Vision</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 font-display">
              Pioneering the spatial web & zero-compromise UX.
            </h3>
            <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
              My goal is to establish new standards for digital craftsmanship. I aim to bridge the gap between heavy 3D rendering engines and lightweight web performance, making interactive 3D web architectures universally accessible across all devices.
            </p>
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-2">
            <span className="font-bold text-cyan-300 block uppercase font-mono tracking-wider">
              Engineering Benchmark:
            </span>
            <p className="italic leading-relaxed">
              "Every pixel, transition curve, and line of code must justify its existence with measurable performance."
            </p>
          </div>
        </div>

        {/* 4 Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onMouseEnter={() => playHoverSound()}
            className="glass-panel rounded-2xl p-6 space-y-3 border border-white/10 dark:border-white/10 light:border-slate-200 hover:-translate-y-1 transition-transform"
          >
            <GlowIconBox size="sm">
              <Layers className="w-4 h-4 text-cyan-400" />
            </GlowIconBox>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
              3D & Spatial Interaction
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Procedural geometry, PBR studio lighting, custom materials, and smooth pointer damping using Three.js.
            </p>
          </div>

          <div
            onMouseEnter={() => playHoverSound()}
            className="glass-panel rounded-2xl p-6 space-y-3 border border-white/10 dark:border-white/10 light:border-slate-200 hover:-translate-y-1 transition-transform"
          >
            <GlowIconBox size="sm">
              <Code2 className="w-4 h-4 text-purple-400" />
            </GlowIconBox>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
              Full-Stack Architecture
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              React 19, TypeScript strict typing, modular hooks, Node/Express backends, and rock-solid APIs.
            </p>
          </div>

          <div
            onMouseEnter={() => playHoverSound()}
            className="glass-panel rounded-2xl p-6 space-y-3 border border-white/10 dark:border-white/10 light:border-slate-200 hover:-translate-y-1 transition-transform"
          >
            <GlowIconBox size="sm">
              <Zap className="w-4 h-4 text-blue-400" />
            </GlowIconBox>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
              Performance & Web Vitals
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Asset optimization, zero layout shift (CLS), 60fps render loops, and top-tier SEO indexes.
            </p>
          </div>

          <div
            onMouseEnter={() => playHoverSound()}
            className="glass-panel rounded-2xl p-6 space-y-3 border border-white/10 dark:border-white/10 light:border-slate-200 hover:-translate-y-1 transition-transform"
          >
            <GlowIconBox size="sm">
              <Rocket className="w-4 h-4 text-emerald-400" />
            </GlowIconBox>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
              Conversion Engineering
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Clean visual hierarchies, frictionless customer booking journeys, and proven UX engagement patterns.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
