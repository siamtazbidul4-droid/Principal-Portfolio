import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'emerald' | 'subtle';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  const base = 'inline-flex items-center font-mono uppercase tracking-wider rounded-full border whitespace-nowrap';

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
  };

  const variants = {
    default: 'bg-[#131313] text-[#A3A39E] border-[#242424]',
    gold: 'bg-[#C9A769]/10 text-[#D4B77C] border-[#C9A769]/30',
    emerald: 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40',
    subtle: 'bg-[#0D0D0D] text-[#73736E] border-[#1C1C1C]',
  };

  const dotColors = {
    default: 'bg-[#73736E]',
    gold: 'bg-[#C9A769]',
    emerald: 'bg-emerald-400 animate-pulse',
    subtle: 'bg-[#52524E]',
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
