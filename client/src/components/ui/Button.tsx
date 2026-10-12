import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'purple' | 'discord';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#0057BE] hover:bg-[#004DA8] active:bg-[#003F8C] text-white focus:ring-[#0057BE]/40 shadow-sm',
    dark: 'bg-[#151C2F] hover:bg-[#1E293B] text-white focus:ring-[#151C2F]/40 shadow-sm',
    secondary: 'bg-white hover:bg-[#F9FAFB] text-[#151C2F] border border-[#E5E7EB] focus:ring-gray-200 shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
    outline: 'bg-transparent hover:bg-gray-50 text-[#151C2F] border border-[#E5E7EB] focus:ring-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100 text-[#667085] hover:text-[#151C2F] focus:ring-gray-200',
    danger: 'bg-[#F26161] hover:bg-[#E05252] text-white focus:ring-red-300 shadow-sm',
    purple: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white focus:ring-purple-300 shadow-sm',
    discord: 'bg-[#5865F2] hover:bg-[#4752C4] text-white focus:ring-indigo-300 shadow-sm',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
