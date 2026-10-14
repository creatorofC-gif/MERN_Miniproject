import React, { useState } from 'react';
import { User as UserIcon, Crown, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'break' | 'focus';
  ring?: 'amber' | 'blue' | 'purple' | 'slate' | 'none';
  plan?: 'free' | 'pro' | 'university';
  showPlanBadge?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  ring,
  plan = 'free',
  showPlanBadge = false,
  className,
}) => {
  const [imgError, setImgError] = useState(false);

  // Compute effective ring based on plan if not explicitly supplied
  const effectiveRing = ring !== undefined
    ? ring
    : plan === 'pro'
    ? 'amber'
    : plan === 'university'
    ? 'blue'
    : 'none';

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  };

  const badgeSizes = {
    xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 p-0.5',
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5 p-0.5',
    md: 'w-4 h-4 -bottom-1 -right-1 p-0.5',
    lg: 'w-5 h-5 -bottom-1 -right-1 p-1',
    xl: 'w-6 h-6 -bottom-1.5 -right-1.5 p-1',
  };

  const badgeIconSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const ringStyles = {
    amber: 'ring-2 ring-[#F59E0B] ring-offset-1 ring-offset-white shadow-xs shadow-amber-500/20',
    blue: 'ring-2 ring-[#0057BE] ring-offset-1 ring-offset-white shadow-xs shadow-blue-500/20',
    purple: 'ring-2 ring-[#8B5CF6] ring-offset-1 ring-offset-white shadow-xs shadow-purple-500/20',
    slate: 'ring-1 ring-gray-300',
    none: '',
  };

  const statusColors = {
    active: 'bg-[#10B981]',
    focus: 'bg-[#8B5CF6]',
    break: 'bg-[#F59E0B]',
  };

  // Plan-specific avatar styling when no image is present
  const planBgStyles = {
    pro: 'bg-gradient-to-tr from-amber-100 via-amber-200 to-yellow-100 text-amber-950 border-amber-300 shadow-xs shadow-amber-400/20',
    university: 'bg-gradient-to-tr from-blue-100 via-indigo-100 to-sky-200 text-[#0057BE] border-blue-300 shadow-xs shadow-blue-400/20',
    free: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
  };

  const hasValidImage = Boolean(src && typeof src === 'string' && src.trim() !== '' && !imgError);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={twMerge(
          clsx(
            'rounded-full overflow-hidden flex items-center justify-center font-bold border select-none transition-all duration-200',
            sizeStyles[size],
            ringStyles[effectiveRing],
            !hasValidImage && planBgStyles[plan],
            className
          )
        )}
      >
        {hasValidImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span
            className={clsx(
              'font-extrabold tracking-tight',
              plan === 'pro'
                ? 'text-amber-950'
                : plan === 'university'
                ? 'text-blue-950'
                : 'text-[#374151]'
            )}
          >
            {initials}
          </span>
        ) : (
          <UserIcon className={clsx('text-[#9CA3AF]', iconSizes[size])} />
        )}
      </div>

      {/* Online / Focus Status Pill */}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white',
            statusColors[status]
          )}
        />
      )}

      {/* Plan Tier Badge (Crown for Pro, Graduation Cap for University) */}
      {showPlanBadge && plan === 'pro' && (
        <div
          title="Pro Scholar"
          className={clsx(
            'absolute rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-xs border border-white',
            badgeSizes[size]
          )}
        >
          <Crown className={clsx('text-white fill-amber-100', badgeIconSizes[size])} />
        </div>
      )}

      {showPlanBadge && plan === 'university' && (
        <div
          title="University Circle"
          className={clsx(
            'absolute rounded-full bg-gradient-to-br from-[#0057BE] to-indigo-700 text-white flex items-center justify-center shadow-xs border border-white',
            badgeSizes[size]
          )}
        >
          <GraduationCap className={clsx('text-white fill-blue-100', badgeIconSizes[size])} />
        </div>
      )}
    </div>
  );
};
