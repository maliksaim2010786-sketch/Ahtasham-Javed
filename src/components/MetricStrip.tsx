import React, { useEffect, useState, useRef } from 'react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { AnimatedCounter } from './AnimatedCounter';

export const MetricStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if initially in viewport
    const checkInitial = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    };
    checkInitial();

    // Trigger whenever entering the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset when scrolled out of view so coming back counts up again
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleReplay = () => {
    playClickSound();
    setIsVisible(false);
    setTimeout(() => {
      setCycleKey((k) => k + 1);
      setIsVisible(true);
    }, 40);
  };

  const metrics = [
    {
      start: 1,
      target: 4,
      prefix: '',
      suffix: '+',
      label: 'Live Production Deployments',
      sub: 'Verified client web applications',
    },
    {
      start: 1,
      target: 100,
      prefix: '',
      suffix: '%',
      label: 'Client Milestone Completion',
      sub: 'Zero missed sprint deadlines',
    },
    {
      start: 1,
      target: 98,
      prefix: '',
      suffix: '+',
      label: 'Lighthouse Performance Score',
      sub: 'SEO, Accessibility & Core Web Vitals',
    },
    {
      start: 1,
      target: 120,
      prefix: '<',
      suffix: 'ms',
      label: 'Micro-Interaction Latency',
      sub: 'Hardware-accelerated animations',
    },
    {
      start: 1,
      target: 250,
      prefix: '',
      suffix: '+',
      label: 'Git Commits & Automated CI',
      sub: 'Strict type safety & modular architecture',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16"
    >
      <div
        onClick={handleReplay}
        title="Click to replay count-up animation"
        className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 border border-white/10 dark:border-white/10 light:border-slate-200 transition-all duration-300 hover:border-cyan-500/40 shadow-xl cursor-pointer group"
      >
        {metrics.map((item, idx) => (
          <div
            key={item.label}
            onMouseEnter={() => playHoverSound()}
            className={`space-y-1 transition-transform duration-300 group-hover:-translate-y-0.5 ${
              idx !== 0 ? 'lg:border-l lg:border-white/10 light:lg:border-slate-200 lg:pl-6' : ''
            }`}
          >
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 font-display">
              <AnimatedCounter
                key={`${item.label}-${cycleKey}`}
                start={item.start}
                target={item.target}
                prefix={item.prefix}
                suffix={item.suffix}
                duration={1500 + idx * 100}
                isVisible={isVisible}
              />
            </div>
            <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 group-hover:text-cyan-300 transition-colors">
              {item.label}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 leading-tight">
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
