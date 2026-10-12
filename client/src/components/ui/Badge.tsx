import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'focus' | 'amber' | 'urgent' | 'purple' | 'blue' | 'neutral' | 'scholar';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantStyles = {
    live: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60',
    focus: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]/60',
    amber: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]/60',
    urgent: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]/60',
    purple: 'bg-[#F5F3FF] text-[#6D28D9]',
    blue: 'bg-[#EAF2FC] text-[#0057BE] border border-[#BFDBFE]/60',
    scholar: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    neutral: 'bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]',
  };

  const dotStyles = {
    live: 'bg-[#10B981]',
    focus: 'bg-[#8B5CF6]',
    amber: 'bg-[#F59E0B]',
    urgent: 'bg-[#EF4444]',
    purple: 'bg-[#8B5CF6]',
    blue: 'bg-[#0057BE]',
    scholar: 'bg-[#F59E0B]',
    neutral: 'bg-[#9CA3AF]',
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotStyles[variant])}
        />
      )}
      {children}
    </span>
  );
};
