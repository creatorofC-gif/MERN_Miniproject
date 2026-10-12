import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  borderAccent?: 'red' | 'amber' | 'blue' | 'purple' | 'none';
  variant?: 'default' | 'subtle' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  borderAccent = 'none',
  variant = 'default',
  className,
  ...props
}) => {
  const accentStyles = {
    red: 'border-l-4 border-l-[#F26161]',
    amber: 'border-l-4 border-l-[#F59E0B]',
    blue: 'border-l-4 border-l-[#0057BE]',
    purple: 'border-l-4 border-l-[#8B5CF6]',
    none: '',
  };

  const variantStyles = {
    default: 'bg-white border border-[#E5E7EB] text-[#151C2F] shadow-[0_1px_3px_rgba(16,24,40,0.04)]',
    subtle: 'bg-[#F8F9FB] border border-[#E5E7EB]/80 text-[#151C2F]',
    dark: 'bg-[#1F2639] border border-[#2D3748] text-white shadow-md',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl transition-all duration-150 relative overflow-hidden',
          variantStyles[variant],
          accentStyles[borderAccent],
          hoverEffect && 'hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] hover:border-[#D1D5DB]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
