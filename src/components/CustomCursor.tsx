import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.hasAttribute('role') ||
          target.getAttribute('type') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp loop for the trailing ring
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center pinpoint */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.6 : 1})`,
        }}
      />
      {/* Outer trailing neon ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-150 ease-out ${
          isHovered
            ? 'w-11 h-11 border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
            : 'w-7 h-7 border-cyan-400/60 bg-transparent shadow-[0_0_10px_rgba(6,182,212,0.3)]'
        }`}
        style={{
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`,
        }}
      />
    </div>
  );
};
