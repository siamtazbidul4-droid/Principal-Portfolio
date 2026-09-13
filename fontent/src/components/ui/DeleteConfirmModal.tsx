import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemType?: string;
  itemName?: string;
  description?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Deletion',
  itemType = 'item',
  itemName,
  description,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
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
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isDeleting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150"
    >
      <div className="bg-[#0D0D0D] border border-[#2B2B2B] rounded-sm max-w-md w-full p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk',sans-serif] uppercase text-[#F5F5F2]">
                {title}
              </h3>
              <p className="text-xs font-mono text-[#888882]">Permanent Action</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-[#888882] hover:text-[#FFFFFF] transition-colors p-1 cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-2 text-xs text-[#CCCCCC] leading-relaxed">
          {description ? (
            <p>{description}</p>
          ) : (
            <p>
              Are you sure you want to permanently delete this {itemType}
              {itemName ? (
                <span className="font-semibold text-[#F5F5F2]"> &ldquo;{itemName}&rdquo;</span>
              ) : (
                ''
              )}
              ? This action will immediately delete the record from persistent storage and cannot be undone.
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F1F1F]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            CANCEL
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-50 text-white font-mono text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-sm"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>DELETING...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE PERMANENTLY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
