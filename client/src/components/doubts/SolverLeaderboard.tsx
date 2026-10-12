import React from 'react';
import { NavLink } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { TopSolver } from '../../types';

interface SolverLeaderboardProps {
  solvers?: TopSolver[];
}

export const SolverLeaderboard: React.FC<SolverLeaderboardProps> = ({ solvers = [] }) => {
  const defaultSolvers: TopSolver[] = [
    {
      _id: '1',
      name: 'Elena R.',
      tier: 'Master',
      points: 12400,
      streak: 42,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      _id: '2',
      name: 'Marcus T.',
      tier: 'Scholar',
      points: 9800,
      streak: 28,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      _id: '3',
      name: 'James L.',
      tier: 'Scholar',
      points: 8100,
      streak: 19,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const list = solvers.length > 0 ? solvers.slice(0, 3) : defaultSolvers;

  return (
    <Card className="p-6 bg-white border border-[#E5E7EB] space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#F59E0B]" />
        <h3 className="text-base font-bold text-[#151C2F]">Top Solvers</h3>
      </div>

      <div className="space-y-2.5">
        {list.map((solver, idx) => {
          const rank = idx + 1;
          const formattedPoints = (solver.points / 1000).toFixed(1) + 'k';

          return (
            <div
              key={solver._id || idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FB] hover:bg-[#F3F4F6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-4 text-center font-bold text-sm text-[#F59E0B]">
                  {rank}
                </span>
                <Avatar src={solver.avatar} name={solver.name} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#151C2F]">{solver.name}</h4>
                  <span className="text-[11px] text-[#667085]">{solver.tier}</span>
                </div>
              </div>

              <span className="text-xs font-bold text-[#151C2F]">
                {formattedPoints}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <NavLink
          to="/leaderboard"
          className="text-xs font-semibold text-[#0057BE] hover:underline"
        >
          View Full Rankings
        </NavLink>
      </div>
    </Card>
  );
};
