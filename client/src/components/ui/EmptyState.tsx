import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-[#E5E7EB] rounded-xl my-4">
      <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[#151C2F]">{title}</h3>
      <p className="text-sm text-[#667085] max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
