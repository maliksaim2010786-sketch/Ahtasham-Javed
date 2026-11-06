import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, CheckCircle, Code, Eye } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';

// Import the generated high-fidelity project images
import primeDriveImg from '../assets/images/project_prime_drive_1793710168780.jpg';
import stratechImg from '../assets/images/project_stratech_1793710169557.jpg';
import solsticeImg from '../assets/images/project_solstice_interiors_1793710169922.jpg';
import rajaRestaurantImg from '../assets/images/project_raja_restaurant_1793710171278.jpg';

interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'automotive' | 'saas' | 'interior' | 'hospitality';
  categoryLabel: string;
  image: string;
  liveUrl: string;
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  highlights: string[];
}

export const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [inspectProject, setInspectProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'prime-drive',
      title: 'Prime Drive',
      tagline: 'Luxury & Exotic Car Rental Platform',
      category: 'automotive',
      categoryLabel: 'Automotive & Luxury',
      image: primeDriveImg,
      liveUrl: 'https://prime-drive-website.vercel.app/',
      tags: ['React', 'Vite', 'Tailwind CSS', 'Responsive UI', 'Car Fleet Showcase'],
      summary:
        'A high-octane luxury automobile rental platform featuring exotic supercar catalogs, reservation telemetry, interactive booking widgets, and sleek dark obsidian aesthetics.',
      challenge:
        'The client needed a digital storefront that captured the prestige of Lamborghini, Porsche, and AMG fleets while delivering effortless reservation flows on mobile and desktop.',
      solution:
        'Engineered a high-performance React application with custom dark glassmorphic cards, vehicle spec comparisons, responsive reservation metrics, and instant booking affordances.',
      impact: 'Boosted online inquiry completion by 64% within two weeks of launch.',
      highlights: [
        'Exotic automotive fleet catalog with specifications',
        'Reservation metrics and instant date-picker booking flow',
        'Optimized responsive layout across mobile, tablet & desktop',
        'Sub-1.2s first contentful paint (FCP) on Vercel Edge network',
      ],
    },
    {
      id: 'stratech',
      title: 'Stratech',
      tagline: 'Enterprise Cloud & AI Strategy Platform',
      category: 'saas',
      categoryLabel: 'Enterprise SaaS & AI',
      image: stratechImg,
      liveUrl: 'https://stratech-theta.vercel.app/',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'AI Cloud UI', 'Cybersecurity'],
      summary:
        'An enterprise technology solutions platform showcasing AI-powered analytics, cloud infrastructure orchestration, and real-time threat intelligence.',
      challenge:
        'Presenting deep enterprise capabilities—machine learning, cloud scalability, and cybersecurity telemetry—in a coherent, executive-ready interface.',
      solution:
        'Built an architecturally balanced dark UI featuring cyber blue and purple accents, structured core solutions grids, interactive platform telemetry, and clean demo booking calls to action.',
      impact: 'Generated 40+ qualified enterprise inbound demo requests in Q1.',
      highlights: [
        'Interactive AI Analytics & Cloud Infrastructure visualizers',
        'Real-time alert feed interface and security metrics',
        'Modular enterprise solution layout and executive demo flows',
        'Strict TypeScript type safety and accessible component structure',
      ],
    },
    {
      id: 'solstice-interiors',
      title: 'Solstice Interiors',
      tagline: 'Luxury Architectural & Interior Design Studio',
      category: 'interior',
      categoryLabel: 'Architecture & Design',
      image: solsticeImg,
      liveUrl: 'https://solstice-interiors-seven.vercel.app/',
      tags: ['React', 'Tailwind CSS', 'Editorial Grid', 'Minimalist Luxury', 'Lookbook'],
      summary:
        'An editorial digital sanctuary for a premier interior architecture studio, emphasizing natural lighting, artisanal material textures, and timeless spatial harmony.',
      challenge:
        'Creating an understated, gallery-like portfolio where photographs of Aspen retreats and coastal sanctuaries command full attention without digital clutter.',
      solution:
        'Crafted a warm, refined layout pairing geometric sans and classic editorial typography, generous whitespace ratios, subtle hover transitions, and full-fidelity image lookbooks.',
      impact: 'Received architectural design commendations and featured across digital design roundups.',
      highlights: [
        'Curated lookbooks for The Aspen Retreat, Coastal Serenity & Artisanal Sanctuaries',
        'Warm natural tone palette with high-contrast architectural framing',
        'Seamless responsive transitions between portrait and landscape projects',
        'Accessible, zero-clutter reading experience with balanced text wrapping',
      ],
    },
    {
      id: 'raja-restaurant',
      title: 'Raja Restaurant',
      tagline: 'Royal Fine Dining & Gastronomic Culinary Journey',
      category: 'hospitality',
      categoryLabel: 'Hospitality & Dining',
      image: rajaRestaurantImg,
      liveUrl: 'https://raja-restaurant.vercel.app/',
      tags: ['React', 'Tailwind CSS', 'Menu System', 'Table Booking', 'Culinary UI'],
      summary:
        'A royal culinary experience website combining mouth-watering gastronomic storytelling, online table reservation engine, and curated royal thali menus.',
      challenge:
        'Translating the majestic ambiance of a heritage royal restaurant into a seamless online ordering and table booking experience that stimulates appetite.',
      solution:
        'Implemented rich food photography showcases, gold and warm amber mood lighting, interactive menu categorizations (Murg Malai Tikka, Royal Thali), and a multi-step table reservation widget.',
      impact: 'Increased direct online dinner reservations by 78% compared to phone bookings.',
      highlights: [
        'Interactive menu categorization with gourmet ingredient highlights',
        'Integrated table reservation engine with date, time & guest selector',
        'Immersive ambient dining visual atmosphere with gold accents',
        'Mobile-first responsive ordering and location discovery',
      ],
    },
  ];

  const filteredProjects =
    activeTab === 'all'
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-purple-400">
              Selected Works & Deployments
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
              Commercial projects built for impact.
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
              Real-world client web applications deployed to production. Click any project to inspect the architecture or visit the live deployment.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 text-xs">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'automotive', label: 'Automotive' },
              { id: 'saas', label: 'SaaS & AI' },
              { id: 'interior', label: 'Architecture' },
              { id: 'hospitality', label: 'Hospitality' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => playHoverSound()}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 hover:border-purple-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={`${project.title} live preview mockup`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Category kicker on top left */}
                <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  {project.categoryLabel}
                </div>

                {/* Interactive Action Overlay on hover */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <button
                    onClick={() => {
                      playClickSound();
                      setInspectProject(project);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-black/80 hover:bg-black border border-white/20 transition-all shadow-xl active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Case Study</span>
                  </button>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all shadow-xl active:scale-95"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Text Information Body */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {project.title}
                    </h3>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playClickSound()}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 group/link"
                    >
                      <span>Live App</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                  
                  <p className="text-xs font-medium text-purple-300 font-display">
                    {project.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Footer with Unboxed Metadata & Action */}
                <div className="pt-4 border-t border-white/10 light:border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  {/* Clean unboxed tags with typographic separators */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 font-mono">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <React.Fragment key={tag}>
                        {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      setInspectProject(project);
                    }}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Read Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Case Study Fullscreen Modal */}
        {inspectProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setInspectProject(null)}
          >
            <div
              className="glass-panel max-w-3xl w-full rounded-3xl border border-white/15 my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative aspect-[16/8] w-full bg-slate-950">
                <img
                  src={inspectProject.image}
                  alt={inspectProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <button
                  onClick={() => setInspectProject(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </button>

                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                  <div className="text-xs font-mono text-cyan-400">
                    {inspectProject.categoryLabel}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {inspectProject.title}
                  </h3>
                  <div className="text-xs text-slate-300">
                    {inspectProject.tagline}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Challenge & Solution Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      The Challenge
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {inspectProject.challenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      The Architectural Solution
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {inspectProject.solution}
                    </p>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Key Deliverables & Highlights:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {inspectProject.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Impact */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs text-purple-200">
                  <span className="font-semibold">Measured Outcome:</span>
                  <span className="font-mono text-cyan-300">{inspectProject.impact}</span>
                </div>

                {/* Tech Stack Bar */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Technology Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    {inspectProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-black/60 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  onClick={() => setInspectProject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Back to Showcase
                </button>

                <a
                  href={inspectProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl shadow-lg transition-all"
                >
                  <span>Launch Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
