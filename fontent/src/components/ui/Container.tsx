import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const maxSizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
  };

  return (
    <div className={`w-full mx-auto px-6 sm:px-8 lg:px-12 ${maxSizes[size]} ${className}`}>
      {children}
    </div>
  );
}
