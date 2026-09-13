import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = '3xl',
  children,
  footer,
  className = '',
}: AdminModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Prevent background body scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth] || 'max-w-3xl';

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div
        className={`relative bg-[#0C0C0C] border border-[#262626] rounded-sm w-full ${maxWidthClasses} flex flex-col shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden ${className}`}
      >
        {/* Header - Pinned at top */}
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#1E1E1E] bg-[#0E0E0E] shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-tight text-[#F5F5F2]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-mono text-[#888882] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#888882] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] rounded-sm transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - The ONLY scrollable region */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {children}
        </div>

        {/* Footer - Pinned at bottom */}
        {footer && (
          <div className="px-6 py-4 sm:px-8 sm:py-4 border-t border-[#1E1E1E] bg-[#0A0A0A] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
