import React from 'react';
import { Avatar } from './Avatar';

interface AvatarGroupItem {
  src?: string;
  name?: string;
}

interface AvatarGroupProps {
  items: AvatarGroupItem[];
  max?: number;
  totalCount?: number;
  size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items,
  max = 3,
  totalCount,
  size = 'sm',
}) => {
  const visibleItems = items.slice(0, max);
  const remaining = totalCount !== undefined ? totalCount - visibleItems.length : items.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visibleItems.map((item, idx) => (
        <Avatar
          key={idx}
          src={item.src}
          name={item.name}
          size={size}
          className="border-2 border-white shadow-xs"
        />
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-[#F3F4F6] text-[#667085] text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs select-none">
          +{remaining}
        </div>
      )}
    </div>
  );
};
