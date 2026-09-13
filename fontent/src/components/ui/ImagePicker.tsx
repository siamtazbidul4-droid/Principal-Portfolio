import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { UploadService } from '../../services/upload.service';

interface ImagePickerProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  className?: string;
}

export function ImagePicker({
  label = 'Image Asset',
  value,
  onChange,
  required = false,
  helperText,
  className = '',
}: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsUploading(true);

    try {
      const result = await UploadService.uploadImage(file);
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setErrorMessage(result.message || 'Failed to upload image.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while uploading.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block font-mono uppercase text-xs text-[#A0A09B] tracking-wider">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-[#888882] hover:text-[#C9A769] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          {showUrlInput ? 'Hide URL Fallback' : 'Or enter Image URL'}
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
        id={`file-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />

      {/* Main Image Selection Area */}
      {value ? (
        /* Preview Card when Image is Selected */
        <div className="relative group border border-[#242424] bg-[#0E0E0E] rounded-sm p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-20 shrink-0 bg-[#161616] border border-[#2A2A2A] rounded-sm overflow-hidden flex items-center justify-center">
            <img
              src={value}
              alt="Selected asset preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if broken URL
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                <Check className="w-3 h-3" /> Ready
              </span>
              <span className="text-xs font-mono text-[#888882] truncate">
                {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : value}
              </span>
            </div>
            <p className="text-[11px] text-[#666662] mt-1 font-mono">
              Click below to choose a different image file from your system.
            </p>

            <div className="flex items-center gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] hover:border-[#C9A769]/60 text-[#D4D4D0] hover:text-[#FFFFFF] text-xs font-mono rounded-sm transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-[#C9A769]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-[#C9A769]" />
                    <span>Choose Image</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 text-xs font-mono text-rose-400/80 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Clear "Choose Image" File Explorer Trigger */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border border-dashed transition-all duration-200 rounded-sm p-6 text-center bg-[#0A0A0A] ${
            dragActive
              ? 'border-[#C9A769] bg-[#C9A769]/5'
              : 'border-[#262626] hover:border-[#383838]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#242424] flex items-center justify-center text-[#C9A769]">
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#C9A769]" />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#C9A769]" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[#E5E5E0]">
                Select an image from your computer
              </p>
              <p className="text-[11px] font-mono text-[#777772]">
                Supports JPEG, PNG, WebP, GIF, SVG (up to 10MB)
              </p>
            </div>

            <button
              type="button"
              id="choose-image-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#222222] border border-[#333333] hover:border-[#C9A769] text-[#F5F5F2] hover:text-[#FFFFFF] text-xs font-mono font-medium rounded-sm transition-all shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-[#C9A769]" />
              <span>{isUploading ? 'Uploading Image...' : 'Choose Image'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Secondary URL Fallback Input */}
      {showUrlInput && (
        <div className="pt-2">
          <div className="flex items-center gap-2 bg-[#121212] border border-[#242424] rounded-sm px-3 py-1.5 focus-within:border-[#C9A769]">
            <Link className="w-3.5 h-3.5 text-[#777772] shrink-0" />
            <input
              type="text"
              placeholder="https://example.com/image.webp or /uploads/..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent text-xs text-[#F5F5F2] focus:outline-none font-mono"
            />
          </div>
          <p className="text-[10px] font-mono text-[#666662] mt-1">
            Optional fallback: Paste an external CDN or asset URL if you prefer not to upload a local file.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/40 p-2 rounded-sm font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && !errorMessage && (
        <p className="text-[11px] font-mono text-[#666662]">{helperText}</p>
      )}
    </div>
  );
}
