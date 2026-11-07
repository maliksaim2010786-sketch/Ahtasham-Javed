import React, { useState } from 'react';
import { 
  Code, Layout, ShoppingCart, Sparkles, RefreshCw, 
  Check, ArrowRight, ShieldCheck, Clock 
} from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number>(0);

  const services = [
    {
      index: '01',
      title: 'Full-Stack Web Development',
      icon: Code,
      headline: 'High-performance React & Node applications built to scale.',
      description:
        'End-to-end full-stack web applications utilizing React 19, TypeScript, and modern API architectures. Every line of code is modular, type-safe, and engineered for sub-second page loads and zero runtime bugs.',
      deliverables: [
        'Custom modular React & TypeScript architecture',
        'Interactive Three.js 3D component integrations',
        'RESTful APIs, middleware & backend route proxies',
        'State management & real-time client hydration',
        'Clean, documented codebase with 100% testable logic',
      ],
      turnaround: '2 - 4 Weeks',
    },
    {
      index: '02',
      title: 'UI/UX Design & Prototyping',
      icon: Layout,
      headline: 'International agency-grade digital aesthetics & design systems.',
      description:
        'Transforming conceptual ideas into tactile, pixel-perfect user journeys. I develop comprehensive design tokens, glassmorphism card systems, fluid typography scales, and cohesive dark/light visual identities.',
      deliverables: [
        'Figma interactive prototypes & clickable wireframes',
        'Custom glassmorphism & futuristic theme tokens',
        'Responsive mobile, tablet & desktop layout grids',
        'Micro-interaction choreography & animation specs',
        'WCAG AA accessible contrast & typography systems',
      ],
      turnaround: '1 - 3 Weeks',
    },
    {
      index: '03',
      title: 'E-commerce & Fleet Booking Solutions',
      icon: ShoppingCart,
      headline: 'Conversion-engineered storefronts and reservation engines.',
      description:
        'Bespoke e-commerce architectures, vehicle rental platforms (like Prime Drive), and reservation systems that maximize checkout conversions without sluggish third-party bloat.',
      deliverables: [
        'Catalog browsing with real-time faceted search & filters',
        'Dynamic multi-step booking & checkout workflows',
        'Stripe/payment gateway integration & webhook security',
        'Inventory/reservation management UI panels',
        'Mobile-first one-thumb checkout optimization',
      ],
      turnaround: '3 - 5 Weeks',
    },
    {
      index: '04',
      title: 'High-Converting Landing Pages',
      icon: Sparkles,
      headline: 'Cinematic storytelling with interactive 3D hero objects.',
      description:
        'Bespoke product launch pages, SaaS presentations, and marketing showcases designed to stop scrollers in their tracks with Three.js 3D objects, smooth scroll reveals, and high-impact CTAs.',
      deliverables: [
        'Interactive 3D Three.js hero object with mouse parallax',
        'Conversion-optimized hero, proof & testimonial sections',
        'Scroll-reveal choreography without UI layout lag',
        'Instant load speeds with 98+ Google Lighthouse scores',
        'Complete OpenGraph, Twitter card & SEO metadata',
      ],
      turnaround: '1 - 2 Weeks',
    },
    {
      index: '05',
      title: 'Website Redesign & Modernization',
      icon: RefreshCw,
      headline: 'Upgrading legacy codebases into modern, ultra-fast platforms.',
      description:
        'Transform dated, slow WordPress or template websites into blindingly fast modern React web applications with contemporary typography, dark mode support, and streamlined UX.',
      deliverables: [
        'Legacy audit: code quality, bundle size & SEO analysis',
        'Zero-downtime migration to modern React & Tailwind',
        '95+ Lighthouse Core Web Vitals optimization',
        'Responsive layout fixes for modern mobile displays',
        'Continuous integration setup on GitHub & Vercel',
      ],
      turnaround: '2 - 3 Weeks',
    },
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Professional Offerings
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
            Specialized engineering services.
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
            Every solution is bespoke, avoiding generic off-the-shelf templates in favor of original code, bespoke 3D assets, and measurable business outcomes.
          </p>
        </div>

        {/* Services Split Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Services Navigation List */}
          <div className="lg:col-span-5 space-y-3">
            {services.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedServiceIdx === idx;
              return (
                <div
                  key={item.index}
                  onMouseEnter={() => playHoverSound()}
                  onClick={() => {
                    playClickSound();
                    setSelectedServiceIdx(idx);
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'glass-panel border-cyan-400/70 bg-gradient-to-r from-purple-900/40 to-cyan-900/30 shadow-lg shadow-cyan-950/40 translate-x-2'
                      : 'border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.06] hover:translate-x-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {item.index}
                    </span>
                    <GlowIconBox size="sm">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </GlowIconBox>
                    <div>
                      <div className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        Avg: {item.turnaround}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1.5' : 'text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right: Selected Service Deep Dive Card */}
          <div className="lg:col-span-7 glass-panel hover-card-3d rounded-3xl p-8 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-6">
            {(() => {
              const active = services[selectedServiceIdx];
              const Icon = active.icon;
              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <GlowIconBox size="lg">
                        <Icon className="w-7 h-7 text-cyan-400" />
                      </GlowIconBox>
                      <div>
                        <div className="text-xs font-mono text-purple-400">
                          SERVICE SPECIFICATION {active.index}
                        </div>
                        <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                          {active.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{active.turnaround}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-base font-semibold text-purple-200 font-display">
                      {active.headline}
                    </div>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                      {active.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Included Deliverables:</span>
                    </div>

                    <div className="space-y-2.5">
                      {active.deliverables.map((del) => (
                        <div key={del} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Inquiry CTA */}
                  <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      Ready to start this service for your brand?
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectService(active.title);
                      }}
                      className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>Inquire About {active.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};
