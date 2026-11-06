import React, { useState, useEffect, useRef } from 'react';
import { Award, Zap, TrendingUp, ShieldCheck, CheckSquare, GitCommit } from 'lucide-react';
import { playHoverSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';
import { AnimatedCounter } from './AnimatedCounter';

export const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkInitial = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    };
    checkInitial();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const achievements = [
    {
      icon: Award,
      start: 1,
      target: 4,
      prefix: '',
      suffix: '',
      unit: ' Commercial Deploys',
      title: 'Full-Stack Production Platforms',
      description:
        'Architected and delivered Prime Drive, Stratech, Solstice Interiors, and Raja Restaurant to live Vercel production with zero critical downtime.',
      metric: '100% Live & Operational',
    },
    {
      icon: TrendingUp,
      start: 1,
      target: 64,
      prefix: '+',
      suffix: '%',
      unit: ' Conversion Boost',
      title: 'Prime Drive Automotive ROI',
      description:
        'Streamlined the exotic vehicle reservation funnel, leading to a 64% uplift in verified online supercar rental bookings within 14 days.',
      metric: 'Prime Drive Platform',
    },
    {
      icon: Zap,
      start: 1,
      target: 98,
      prefix: '',
      suffix: '+',
      unit: ' Lighthouse Index',
      title: 'Performance & Core Web Vitals',
      description:
        'Sub-second first contentful paint (FCP) and near-zero cumulative layout shift (CLS) achieved through asset compression and lean CSS architecture.',
      metric: 'Google PageSpeed Verified',
    },
    {
      icon: ShieldCheck,
      start: 1,
      target: 100,
      prefix: '',
      suffix: '%',
      unit: ' Type-Safe Code',
      title: 'Strict TypeScript Standard',
      description:
        'Zero compile-time loose types or implicit `any`. Strict discriminated unions and complete interface definitions across all components.',
      metric: 'Enterprise Architecture',
    },
    {
      icon: CheckSquare,
      start: 1,
      target: 100,
      prefix: '',
      suffix: '%',
      unit: ' On-Time Delivery',
      title: 'Sprint Milestone Integrity',
      description:
        'Honored all project deadlines across initial discovery, interactive prototyping, full-stack code, and final edge CDN deployment.',
      metric: '4 of 4 On Schedule',
    },
    {
      icon: GitCommit,
      start: 1,
      target: 250,
      prefix: '',
      suffix: '+',
      unit: ' Clean Git Commits',
      title: 'Continuous Integration Workflows',
      description:
        'Maintained structured conventional commit messages, feature-branch workflows, and automated regression validations on GitHub.',
      metric: 'Version Controlled',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Proven Track Record
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
            Milestones and verified achievements.
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
            Quantifiable results derived directly from commercial project rollouts, client business impact, and engineering benchmarks.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                onMouseEnter={() => playHoverSound()}
                className="glass-panel rounded-3xl p-7 border border-white/10 dark:border-white/10 light:border-slate-200 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <GlowIconBox size="md">
                      <Icon className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
                    </GlowIconBox>
                    <span className="text-xs font-mono text-purple-400 font-semibold bg-purple-950/30 border border-purple-500/20 px-2.5 py-1 rounded-md">
                      {item.metric}
                    </span>
                  </div>

                  <div>
                    <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-200 font-display">
                      <AnimatedCounter
                        start={item.start}
                        target={item.target}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        duration={1400 + idx * 100}
                        isVisible={isVisible}
                      />
                      <span>{item.unit}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
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
