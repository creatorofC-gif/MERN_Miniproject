import React from 'react';
import { Flame, LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  color?: 'amber' | 'blue' | 'purple' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon = Flame,
  trend,
  color = 'blue',
}) => {
  const colorMap = {
    amber: 'bg-[#FEF3C7] text-[#F59E0B]',
    blue: 'bg-[#EAF2FC] text-[#0057BE]',
    purple: 'bg-purple-50 text-[#8B5CF6]',
    green: 'bg-[#ECFDF5] text-[#10B981]',
  };

  return (
    <Card className="p-5 flex flex-col justify-between h-40 bg-white border border-[#E5E7EB] shadow-xs">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">{title}</span>
        <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-[#667085] mt-1 font-medium">{subtitle}</p>}
      </div>

      {trend && (
        <div className="text-[11px] font-bold text-[#10B981] flex items-center gap-1">
          <span>{trend}</span>
        </div>
      )}
    </Card>
  );
};
