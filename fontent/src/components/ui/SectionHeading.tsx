import React from 'react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  badgeVariant?: 'default' | 'gold' | 'emerald';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  badgeVariant = 'gold',
  className = '',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignment} ${className}`}>
      {eyebrow && (
        <div className="mb-4">
          <Badge variant={badgeVariant} dot={badgeVariant === 'gold'}>
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.12]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#969691] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
