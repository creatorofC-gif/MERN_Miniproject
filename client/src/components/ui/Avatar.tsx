import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'break' | 'focus';
  ring?: 'amber' | 'blue' | 'purple' | 'none';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  ring = 'none',
  className,
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const ringStyles = {
    amber: 'ring-2 ring-[#F59E0B] ring-offset-1',
    blue: 'ring-2 ring-[#0057BE] ring-offset-1',
    purple: 'ring-2 ring-[#8B5CF6] ring-offset-1',
    none: '',
  };

  const statusColors = {
    active: 'bg-[#10B981]',
    focus: 'bg-[#8B5CF6]',
    break: 'bg-[#F59E0B]',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={twMerge(
          clsx(
            'rounded-full overflow-hidden flex items-center justify-center font-medium bg-[#E0E7FF] text-[#3730A3] select-none',
            sizeStyles[size],
            ringStyles[ring],
            className
          )
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
