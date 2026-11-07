import React, { useEffect, useRef, useState } from 'react';
import { 
  X, MessageCircle, Phone, Mail, Sparkles, ExternalLink, 
  Check, Copy, ArrowRight, ShieldCheck, Download, User 
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome?: () => void;
  onHireClick?: () => void;
  onViewProjects?: () => void;
  portraitSrc?: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onHireClick,
  onViewProjects,
  portraitSrc = '/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png',
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const directEmail = 'malikahtashamjaved@gmail.com';
  const whatsappNumber = '0300 7118380';
  const whatsappUrl = 'https://wa.me/923007118380?text=Hello%20Ahtasham!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    playSuccessSound();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      x: ((y - centerY) / centerY) * -12,
      y: ((x - centerX) / centerX) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-panel max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-white/20 relative my-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              Ahtasham Javed · Developer Profile
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Split Content: Large Photo + Bio Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6 relative z-10">
          
          {/* Left Column: High-Res Interactive 3D Cutout Card */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: '1000px',
              }}
              className="w-full max-w-[280px] aspect-[3/4] relative rounded-3xl p-3 bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/20 shadow-2xl flex items-center justify-center group cursor-pointer"
            >
              <div
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
                  transformStyle: 'preserve-3d',
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
                }}
                className="w-full h-full relative flex items-center justify-center"
              >
                {/* Holographic Glowing Backing */}
                <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-purple-500/30 to-cyan-500/30 blur-xl group-hover:scale-125 transition-transform duration-500" />
                
                {/* Crystal Clear Cutout Image */}
                <img
                  src={portraitSrc}
                  alt="Ahtasham Javed"
                  className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
                />

                {/* 3D Floating Chip */}
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-center"
                >
                  <span className="text-[10px] font-mono font-semibold text-cyan-300 uppercase tracking-widest">
                    Verified 3D Architect
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Hover image for 3D tilt perspective</span>
            </p>
          </div>

          {/* Right Column: Bio, Credentials & Actions */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                Full-Stack Developer & UI Architect
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                Ahtasham Javed
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                Crafting next-generation 3D web environments, conversion-driven web applications, and high-performance digital platforms using React 19, TypeScript, Three.js, and Node.js.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-2.5">
              {/* WhatsApp Card */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-300 font-mono">WhatsApp Instant</div>
                    <div className="text-xs font-bold text-white">{whatsappNumber}</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Chat Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Direct Email Card with One-Click Copy */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-white">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] text-purple-300 font-mono">Direct Email</div>
                    <div className="text-xs font-bold text-white truncate font-mono">{directEmail}</div>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone Dial */}
              <a
                href="tel:03007118380"
                onClick={() => playClickSound()}
                className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-cyan-300 font-mono">Direct Phone Call</div>
                    <div className="text-xs font-bold text-white">0300 7118380</div>
                  </div>
                </div>
                <div className="text-xs text-cyan-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Call Direct</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                  onNavigateHome?.();
                }}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Go to Home Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                  onHireClick?.();
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Hire Me</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              {onViewProjects && (
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    onViewProjects();
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  View Projects
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
