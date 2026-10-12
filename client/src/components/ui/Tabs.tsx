import React from 'react';
import { clsx } from 'clsx';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'buttons';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto pb-1 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2',
                isActive
                  ? 'bg-[#0057BE] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#151C2F] border border-[#E5E7EB] hover:bg-gray-50'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span
                  className={clsx(
                    'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#667085]'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={`flex border-b border-[#E5E7EB] gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'pb-3 text-sm font-medium transition-all relative cursor-pointer flex items-center gap-2',
              isActive
                ? 'text-[#0057BE] font-semibold border-b-2 border-[#0057BE]'
                : 'text-[#667085] hover:text-[#151C2F]'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 text-[#667085] font-semibold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
