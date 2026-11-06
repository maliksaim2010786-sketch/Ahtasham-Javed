import React, { useState } from 'react';
import { Search, PenTool, Terminal, Rocket, CheckCircle2 } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Discovery & Strategic Scoping',
      icon: Search,
      badge: 'Week 1',
      summary:
        'Deconstructing business goals, user personas, technical requirements, and defining high-impact metrics.',
      details: [
        'Stakeholder technical interview and project requirements audit',
        'Competitor teardown and distinctive aesthetic direction alignment',
        'Technical architecture selection (React, Three.js, API design, hosting)',
        'Comprehensive milestone timeline and scope definition',
      ],
      output: 'Project Architecture Blueprint & Design Scope',
    },
    {
      num: '02',
      title: 'Design & Spatial Prototyping',
      icon: PenTool,
      badge: 'Week 1 - 2',
      summary:
        'Crafting pixel-perfect layouts, responsive design tokens, and testing 3D spatial concepts.',
      details: [
        'Figma high-fidelity interactive wireframes and design system tokens',
        '3D asset exploration and Three.js geometry/lighting simulations',
        'Typography pairings and dark/light mode optical compensation',
        'Client review checkpoint and design lock before code',
      ],
      output: 'Approved High-Fidelity Interactive Prototype',
    },
    {
      num: '03',
      title: 'Development & 3D Integration',
      icon: Terminal,
      badge: 'Week 2 - 4',
      summary:
        'Translating designs into clean, modular TypeScript code with hardware-accelerated 3D rendering.',
      details: [
        'Component development with strict TypeScript contracts & Tailwind styling',
        'Three.js scene graph setup with software WebGL fallback guards',
        'Real-time state hydration, API proxy routing & form validations',
        'Rigorous cross-device testing across iOS Safari, Android Chrome, and Desktop',
      ],
      output: 'Staging Production Web Application',
    },
    {
      num: '04',
      title: 'Launch & Continuous Optimization',
      icon: Rocket,
      badge: 'Week 4+',
      summary:
        'Deploying to global CDN edge networks with automated CI/CD and sub-second Lighthouse scores.',
      details: [
        'Production build audits, tree-shaking, and asset compression',
        'Lighthouse 95+ score tuning for SEO, Accessibility & Core Web Vitals',
        'Automated CI/CD deployment on Vercel / Cloud Run',
        'Handover documentation, walkthrough video, and post-launch support',
      ],
      output: 'Live Deployed Platform with 99.9% Uptime Guarantee',
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Work Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
            A transparent, sprint-driven workflow.
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
            From initial discovery to zero-downtime production launch, every milestone is structured for clarity, speed, and uncompromising quality.
          </p>
        </div>

        {/* 4-Step Interactive Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => playHoverSound()}
                onClick={() => {
                  playClickSound();
                  setActiveStep(idx);
                }}
                className={`glass-panel rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isCurrent
                    ? 'border-cyan-400/50 bg-gradient-to-b from-purple-950/40 to-cyan-950/20 shadow-xl shadow-cyan-950/20 -translate-y-1'
                    : 'border-white/10 dark:border-white/10 light:border-slate-200 hover:border-white/20'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-display">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      {step.badge}
                    </span>
                  </div>

                  <GlowIconBox size="md">
                    <Icon className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
                  </GlowIconBox>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                      {step.summary}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="pt-2 space-y-2 border-t border-white/10 light:border-slate-200">
                    {step.details.map((point) => (
                      <div key={point} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 light:border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500">Milestone Output</div>
                  <div className="text-xs font-semibold text-cyan-300 font-display mt-0.5">
                    {step.output}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
