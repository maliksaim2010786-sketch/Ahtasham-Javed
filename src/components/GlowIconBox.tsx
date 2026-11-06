import React from 'react';

interface GlowIconBoxProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  innerClassName?: string;
}

export const GlowIconBox: React.FC<GlowIconBoxProps> = ({
  children,
  size = 'md',
  className = '',
  innerClassName = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const innerSizeClasses = {
    sm: 'rounded-[10px]',
    md: 'rounded-[14px]',
    lg: 'rounded-[14px]',
    xl: 'rounded-[22px]',
  };

  return (
    <div className={`glow-rotating-ring ${sizeClasses[size]} ${className}`}>
      <div className={`glow-rotating-inner ${innerSizeClasses[size]} ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
