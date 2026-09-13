import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'right',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A769] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707] rounded-sm';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[#C9A769] text-[#070707] hover:bg-[#D4B77C] active:bg-[#B89658] font-semibold shadow-sm',
      secondary:
        'bg-[#131313] text-[#F5F5F2] border border-[#242424] hover:bg-[#1A1A1A] hover:border-[#383838] active:bg-[#111111]',
      outline:
        'bg-transparent text-[#E2E2DE] border border-[#2E2E2E] hover:border-[#C9A769] hover:text-[#FFFFFF] active:bg-[#141414]',
      ghost:
        'bg-transparent text-[#969691] hover:text-[#F5F5F2] hover:bg-[#131313]/60 active:bg-[#161616]',
      danger:
        'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60 active:bg-rose-950',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
