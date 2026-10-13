import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Doubt } from '../../types';

export interface LatestDoubtsProps {
  doubts?: Doubt[];
  onSelectDoubt?: (doubtId: string) => void;
}

export const LatestDoubts: React.FC<LatestDoubtsProps> = ({ doubts = [], onSelectDoubt }) => {
  return (
    <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between h-64">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#151C2F]">Latest Doubts</h3>
          <NavLink
            to="/doubts"
            className="text-xs font-semibold text-[#0057BE] hover:underline"
          >
            Solve & Earn
          </NavLink>
        </div>

        <div className="space-y-3">
          {doubts.length === 0 ? (
            <div className="py-7 text-center text-xs text-[#98A2B3]">
              <p>No unanswered doubts right now.</p>
              <NavLink to="/doubts" className="text-[#0057BE] font-semibold hover:underline mt-1.5 inline-block">
                Browse academic doubts
              </NavLink>
            </div>
          ) : (
            doubts.slice(0, 2).map((doubt, idx) => (
              <NavLink
                key={doubt._id || doubt.id}
                to="/doubts"
                className={`block p-3 rounded-xl border border-[#E5E7EB] border-l-4 ${
                  doubt.isUrgent || idx === 0 ? 'border-l-[#F26161]' : 'border-l-[#F59E0B]'
                } hover:bg-[#F8F9FB] transition-all`}
              >
                <h4 className="text-sm font-semibold text-[#151C2F] truncate mb-2">
                  {doubt.title}
                </h4>
                <div className="flex items-center gap-2">
                  {doubt.isUrgent || idx === 0 ? (
                    <Badge variant="urgent" size="sm">
                      Urgent
                    </Badge>
                  ) : (
                    <Badge variant="amber" size="sm">
                      Bounty
                    </Badge>
                  )}
                  <span className="text-xs font-bold text-[#667085]">
                    +{doubt.pointsReward || (idx === 0 ? 50 : 120)} pts
                  </span>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#98A2B3] text-center">
        Earn badges and level up your mastery ranking
      </p>
    </Card>
  );
};
