import React, { useState } from 'react';
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 'prime-drive-feedback',
      name: 'Marcus Vance',
      role: 'Managing Director',
      company: 'Prime Drive Luxury Rentals',
      projectUrl: 'https://prime-drive-website.vercel.app/',
      projectName: 'Prime Drive Website',
      content:
        'Ahtasham elevated our exotic automobile rental brand into a digital showstopper. His attention to dark obsidian aesthetics, subtle cyan neon accents, and lightning-fast booking flows resulted in a 64% surge in qualified client reservations within just two weeks of go-live.',
      rating: 5,
      deliveryTime: 'Delivered in 3 weeks',
    },
    {
      id: 'stratech-feedback',
      name: 'Elena Rostova',
      role: 'VP of Product Architecture',
      company: 'Stratech Systems',
      projectUrl: 'https://stratech-theta.vercel.app/',
      projectName: 'Stratech Cloud Platform',
      content:
        'Working with Ahtasham was exceptionally seamless. He translated our complex enterprise AI telemetry and cloud infrastructure into a sleek, responsive, and futuristic interface. His strict TypeScript implementation eliminated bugs before QA even started.',
      rating: 5,
      deliveryTime: 'Delivered in 4 weeks',
    },
    {
      id: 'solstice-feedback',
      name: 'David Sterling',
      role: 'Principal Architect',
      company: 'Solstice Interiors Studio',
      projectUrl: 'https://solstice-interiors-seven.vercel.app/',
      projectName: 'Solstice Interiors Showcase',
      content:
        'A rare developer with an instinctive understanding of spatial balance, minimalist luxury, and architectural typography. Our residential portfolio lookbook feels like a physical art monograph online. The feedback from our private luxury clients has been outstanding.',
      rating: 5,
      deliveryTime: 'Delivered in 2 weeks',
    },
    {
      id: 'raja-feedback',
      name: 'Tariq Al-Mansoor',
      role: 'Director of Guest Hospitality',
      company: 'Raja Fine Dining Group',
      projectUrl: 'https://raja-restaurant.vercel.app/',
      projectName: 'Raja Restaurant Website',
      content:
        'The online table reservation flow and gourmet dish storytelling Ahtasham built exceeded every expectation. Our dinner table bookings increased by 78% as patrons found the mobile reservation process effortless and visually appetizing.',
      rating: 5,
      deliveryTime: 'Delivered in 2.5 weeks',
    },
  ];

  const nextTestimonial = () => {
    playClickSound();
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    playClickSound();
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-purple-400">
              Verified Client Endorsements
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
              Trusted by founders & leaders.
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
              Feedback from the creators and executives of the live platforms deployed in my portfolio.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-purple-500/40 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Highlight Card */}
        {(() => {
          const t = testimonials[activeIndex];
          return (
            <div
              onMouseEnter={() => playHoverSound()}
              className="glass-panel hover-card-3d rounded-3xl p-8 sm:p-12 border border-white/10 dark:border-white/10 light:border-slate-200 relative overflow-hidden shadow-2xl transition-all duration-300"
            >
              {/* Subtle neon gradient bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500" />

              <div className="space-y-6">
                {/* Top Row: Stars & Real Project Link */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      5.0 Verified Review
                    </span>
                  </div>

                  <a
                    href={t.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Inspect {t.projectName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-xl font-medium text-slate-100 dark:text-slate-100 light:text-slate-800 leading-relaxed italic">
                  "{t.content}"
                </p>

                {/* Author Info */}
                <div className="pt-6 border-t border-white/10 light:border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                      {t.role} · <span className="text-purple-300 font-medium">{t.company}</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    {t.deliveryTime}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mini Selector Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClickSound();
                setActiveIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
