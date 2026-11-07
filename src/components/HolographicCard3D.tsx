import React, { useState, useRef } from 'react';
import { Sparkles, Shield, UserCheck, Terminal, Award } from 'lucide-react';
import { playHoverSound } from '../utils/audio';

interface HolographicCard3DProps {
  imageSrc?: string;
  name?: string;
  role?: string;
  className?: string;
}

export const HolographicCard3D: React.FC<HolographicCard3DProps> = ({
  imageSrc = '/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png',
  name = 'Ahtasham Javed',
  role = '3D Web Architect & Full-Stack Engineer',
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -16; // Max 16 deg
    const rotateY = ((x - centerX) / centerX) * 16;

    setRotate({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseEnter = () => {
    playHoverSound();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className={`relative w-full aspect-[4/5] max-w-[420px] mx-auto select-none ${className}`}
      style={{ perspective: '1100px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full rounded-3xl glass-panel p-5 overflow-hidden transition-transform duration-200 ease-out border border-white/20 shadow-2xl cursor-pointer group"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
            isHovered ? 'scale3d(1.03, 1.03, 1.03)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic Dynamic Glare Layer */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(6, 182, 212, 0.45) 0%, rgba(168, 85, 247, 0.25) 30%, transparent 65%)`,
            mixBlendMode: 'screen',
          }}
        />

        {/* Ambient Neon Backing */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-slate-900/50 to-cyan-900/20 pointer-events-none rounded-3xl" />

        {/* Corner Cyber Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-400/70 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-400/70 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

        {/* Floating Top Status Chip (3D elevation) */}
        <div
          className="relative z-20 flex items-center justify-between text-xs font-mono text-cyan-300"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>3D INTERACTIVE AVATAR</span>
          </div>

          <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20">
            PERSPECTIVE TILT
          </div>
        </div>

        {/* Central 3D Portrait Image */}
        <div
          className="relative z-10 w-full h-[76%] flex items-center justify-center mt-2 overflow-hidden"
          style={{ transform: 'translateZ(45px)' }}
        >
          {/* Circular Holographic Aura */}
          <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-purple-600/35 to-cyan-500/35 blur-2xl group-hover:scale-110 transition-transform duration-500" />
          
          <img
            src={imageSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="relative z-10 max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          />
        </div>

        {/* Bottom Floating Info Plate (3D elevation) */}
        <div
          className="absolute bottom-4 left-4 right-4 z-20 p-3.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl space-y-1"
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-display">
              {name}
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Verified Dev
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono truncate">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};
