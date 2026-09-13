import React from 'react';
import { FolderGit2 } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No records found',
  description = 'There are currently no items available to display.',
  actionLabel,
  onAction,
  icon = <FolderGit2 className="w-8 h-8 text-[#969691]" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0D0D0D] border border-[#242424] rounded-sm max-w-lg mx-auto">
      <div className="p-3 bg-[#161616] border border-[#262626] rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#F5F5F2] tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-[#969691] max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
