import React, { useState } from 'react';
import { 
  FileCode, Palette, Terminal, Atom, Server, Box, 
  GitBranch, Cpu, Code2, Globe, Sparkles, CheckCircle2 
} from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';
import { AnimatedCounter } from './AnimatedCounter';

interface SkillItem {
  id: string;
  name: string;
  category: 'frontend' | '3d' | 'backend' | 'devops';
  icon: React.ElementType;
  proficiency: number;
  experience: string;
  description: string;
  keyTools: string[];
}

export const Skills: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | '3d' | 'backend' | 'devops'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const skills: SkillItem[] = [
    {
      id: 'threejs',
      name: 'Three.js & WebGL',
      category: '3d',
      icon: Box,
      proficiency: 94,
      experience: '2+ Years',
      description: 'Creating interactive procedural 3D scenes, custom PBR materials, particle systems, orbit kinematics, and software WebGL guards.',
      keyTools: ['OrbitControls', 'PBR Shaders', 'InstancedMesh', 'Raycasting', 'Fog & Lighting'],
    },
    {
      id: 'react',
      name: 'React 19 & Next Architecture',
      category: 'frontend',
      icon: Atom,
      proficiency: 96,
      experience: '3+ Years',
      description: 'Building modular component systems, functional hooks, concurrent rendering, dynamic state management, and SSR/SSG pipelines.',
      keyTools: ['Custom Hooks', 'Context API', 'Suspense', 'Virtualization', 'Vite HMR'],
    },
    {
      id: 'javascript',
      name: 'Modern JavaScript (ESNext)',
      category: 'frontend',
      icon: Terminal,
      proficiency: 95,
      experience: '3+ Years',
      description: 'Deep mastery of asynchronous programming, closures, event loops, Web APIs, Canvas 2D, and Web Audio API synthesis.',
      keyTools: ['Async/Await', 'Generators', 'Web Audio API', 'DOM Optimization', 'IntersectionObserver'],
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'frontend',
      icon: Code2,
      proficiency: 92,
      experience: '2+ Years',
      description: 'Strict type safety, generic constraints, discriminated unions, and scalable enterprise codebases with zero compile-time bugs.',
      keyTools: ['Strict Null Checks', 'Generics', 'Utility Types', 'AST Parsing', 'Declaration Merging'],
    },
    {
      id: 'html-css',
      name: 'HTML5 & Semantic SEO',
      category: 'frontend',
      icon: FileCode,
      proficiency: 98,
      experience: '4+ Years',
      description: 'Strict semantic markup, WCAG AA accessibility compliance, OpenGraph social protocols, and structured microdata.',
      keyTools: ['Semantic Tags', 'ARIA Roles', 'Microdata', 'Meta Protocols', 'Canvas 2D'],
    },
    {
      id: 'css-tailwind',
      name: 'CSS3 & Tailwind CSS',
      category: 'frontend',
      icon: Palette,
      proficiency: 96,
      experience: '3+ Years',
      description: 'Tailwind v4 architecture, fluid clamp() typography, responsive grid & flexbox math, CSS variables, and glassmorphic filters.',
      keyTools: ['Tailwind v4', 'CSS Grid', 'Custom Variants', 'Hardware Transitions', 'Keyframe Curves'],
    },
    {
      id: 'nodejs',
      name: 'Node.js & Express',
      category: 'backend',
      icon: Server,
      proficiency: 88,
      experience: '2+ Years',
      description: 'Building secure RESTful microservices, Express middleware, server-side route proxies, CORS configurations, and rate limiters.',
      keyTools: ['Express.js', 'REST APIs', 'JWT Auth', 'Middleware Chaining', 'EventEmitters'],
    },
    {
      id: 'github',
      name: 'GitHub & CI/CD',
      category: 'devops',
      icon: GitBranch,
      proficiency: 90,
      experience: '3+ Years',
      description: 'Version control branch workflows, automated GitHub Actions, semantic commit conventions, and Vercel/Cloud deployment pipelines.',
      keyTools: ['Git Branching', 'GitHub Actions', 'Vercel Deployment', 'Pull Request Audits', 'Rollbacks'],
    },
    {
      id: 'performance',
      name: 'Performance & Optimization',
      category: 'devops',
      icon: Cpu,
      proficiency: 93,
      experience: '2+ Years',
      description: 'Lighthouse 95+ score tuning, code-splitting, tree-shaking, lazy image loading, and zero layout shifts (CLS).',
      keyTools: ['Core Web Vitals', 'Tree Shaking', 'Bundle Analysis', 'Lazy Loading', 'Cache Strategies'],
    },
  ];

  const filteredSkills = activeFilter === 'all' 
    ? skills 
    : skills.filter((s) => s.category === activeFilter);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
              Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
              Mastering the modern 3D & full-stack web stack.
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
              A comprehensive toolkit honed across commercial platforms, interactive web experiences, and scalable enterprise codebases.
            </p>
          </div>

          {/* Interactive Filter Tabs (Functional buttons per frontend-design) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 text-xs">
            {(
              [
                { id: 'all', label: 'All Stack' },
                { id: 'frontend', label: 'Frontend' },
                { id: '3d', label: '3D & WebGL' },
                { id: 'backend', label: 'Backend' },
                { id: 'devops', label: 'DevOps & Git' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <div
                key={skill.id}
                onMouseEnter={() => playHoverSound()}
                onClick={() => {
                  playClickSound();
                  setSelectedSkill(skill);
                }}
                className="glass-panel rounded-2xl p-6 border border-white/10 dark:border-white/10 light:border-slate-200 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <GlowIconBox size="md">
                      <IconComponent className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
                    </GlowIconBox>
                    <div className="text-right">
                      <span className="text-xs font-mono text-cyan-400 tabular-nums font-semibold">
                        <AnimatedCounter start={1} target={skill.proficiency} suffix="%" duration={1400} />
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {skill.experience}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 light:border-slate-200">
                  {/* Clean unboxed tool tags */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                    {skill.keyTools.slice(0, 3).map((tool, idx) => (
                      <React.Fragment key={tool}>
                        {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
                        <span>{tool}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill Details Modal */}
        {selectedSkill && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedSkill(null)}
          >
            <div
              className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-white/15 relative space-y-5 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <GlowIconBox size="md">
                    <selectedSkill.icon className="w-6 h-6 text-cyan-400" />
                  </GlowIconBox>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {selectedSkill.name}
                    </h3>
                    <div className="text-xs text-cyan-400 font-mono">
                      Proficiency: {selectedSkill.proficiency}% · {selectedSkill.experience} in Production
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedSkill.description}
              </p>

              <div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Specialized Capabilities & Tools:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedSkill.keyTools.map((tool) => (
                    <div key={tool} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
