import React from 'react';

export const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Glowing Orb 1 */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/15 to-purple-500/15 blur-[90px] animate-float-slow" />

      {/* Floating Glowing Orb 2 */}
      <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/15 to-pink-500/15 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Floating Glowing Orb 3 */}
      <div className="absolute bottom-[20%] left-[25%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/10 to-cyan-500/15 blur-[100px] animate-float-slow" style={{ animationDelay: '3s' }} />

      {/* Floating Cyber Particle Dots */}
      <div className="absolute top-[22%] left-[30%] w-2 h-2 rounded-full bg-cyan-400 animate-particle shadow-[0_0_12px_rgba(6,182,212,0.9)]" style={{ animationDuration: '4s' }} />
      <div className="absolute top-[55%] left-[12%] w-1.5 h-1.5 rounded-full bg-purple-400 animate-particle shadow-[0_0_10px_rgba(168,85,247,0.9)]" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-[35%] right-[22%] w-2.5 h-2.5 rounded-full bg-pink-400 animate-particle shadow-[0_0_14px_rgba(244,63,94,0.9)]" style={{ animationDuration: '5.5s', animationDelay: '2s' }} />
      <div className="absolute bottom-[30%] right-[35%] w-2 h-2 rounded-full bg-emerald-400 animate-particle shadow-[0_0_12px_rgba(52,211,153,0.9)]" style={{ animationDuration: '4.8s', animationDelay: '1.5s' }} />
      <div className="absolute top-[75%] left-[45%] w-1.5 h-1.5 rounded-full bg-amber-400 animate-particle shadow-[0_0_10px_rgba(251,191,36,0.9)]" style={{ animationDuration: '6.5s', animationDelay: '2.5s' }} />
    </div>
  );
};
