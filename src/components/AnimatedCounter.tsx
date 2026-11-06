import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  start?: number;
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  isVisible?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  start = 1,
  target,
  prefix = '',
  suffix = '',
  duration = 1800,
  isVisible = true,
  className = '',
}) => {
  const [count, setCount] = useState<number>(start);

  useEffect(() => {
    if (!isVisible) {
      setCount(start);
      return;
    }

    let startTime: number | null = null;
    let animId = 0;

    // Exponential easeOut for silky-smooth deceleration
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentVal = Math.round(start + (target - start) * easedProgress);
      setCount(currentVal);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isVisible, start, target, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};
