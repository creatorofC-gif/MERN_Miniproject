import React from 'react';
import { Flame, Award, LucideIcon } from 'lucide-react';
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

interface ActiveStreakCardProps {
  streakDays: number;
  daysToMilestone: number;
}

export const ActiveStreakCard: React.FC<ActiveStreakCardProps> = ({
  streakDays = 0,
  daysToMilestone = 7,
}) => {
  const progressPercent = ((streakDays % 10) / 10) * 100 || (streakDays > 0 ? 60 : 0);

  return (
    <Card className="p-6 flex flex-col justify-between h-44 bg-white border border-[#E5E7EB]">
      <div className="flex items-start justify-between">
        <span className="text-base font-bold text-[#151C2F]">Active Streak</span>
        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center">
          <Flame className="w-5 h-5 fill-current" />
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-[#151C2F] tracking-tight">{streakDays}</span>
          <span className="text-sm font-medium text-[#667085]">days</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#F59E0B] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-[#667085]">
          {streakDays === 0 ? 'Start your streak today' : `${daysToMilestone} days until next milestone`}
        </p>
      </div>
    </Card>
  );
};

interface JourneyToMentorCardProps {
  currentPoints?: number;
  targetPoints?: number;
  tierName?: string;
}

export const JourneyToMentorCard: React.FC<JourneyToMentorCardProps> = ({
  currentPoints = 0,
  targetPoints = 1000,
  tierName = 'Novice Scholar',
}) => {
  const progressPercent = Math.min(100, Math.max(0, ((currentPoints) / (targetPoints)) * 100));

  return (
    <Card className="p-6 flex flex-col justify-between h-44 bg-white border border-[#E5E7EB]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-[#151C2F]">Journey to Mentor</span>
            <Award className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-xs text-[#667085] mt-1">
            You are currently a <span className="text-[#F59E0B] font-semibold">{tierName}</span>
          </p>
        </div>

        <span className="text-2xl font-extrabold text-[#151C2F]">
          {currentPoints.toLocaleString()} <span className="text-lg font-bold text-[#667085]">/ {targetPoints.toLocaleString()} pts</span>
        </span>
      </div>

      <div className="space-y-2 mt-4">
        <div className="relative w-full bg-[#F3F4F6] h-2.5 rounded-full overflow-visible flex items-center">
          <div
            className="bg-gradient-to-r from-[#0057BE] to-[#3B82F6] h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#0057BE] shadow-xs transform -translate-y-0"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-[#667085]">
          <span>Scholar (1k)</span>
          <span>Mentor (2k)</span>
        </div>
      </div>
    </Card>
  );
};
