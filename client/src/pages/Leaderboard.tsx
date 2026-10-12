import React, { useState } from 'react';
import { Trophy, Flame, Medal, Award, Star, ArrowUpRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/Avatar';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  college: string;
  points: number;
  streak: number;
  doubtsSolved: number;
  tier: string;
  isCurrentUser?: boolean;
}

const MOCK_LEADERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    points: 2450,
    streak: 28,
    doubtsSolved: 64,
    tier: 'Grandmaster',
  },
  {
    rank: 2,
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    points: 1250,
    streak: 14,
    doubtsSolved: 42,
    tier: 'Master Tier',
    isCurrentUser: true,
  },
  {
    rank: 3,
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'MIT',
    points: 980,
    streak: 9,
    doubtsSolved: 31,
    tier: 'Senior Scholar',
  },
  {
    rank: 4,
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'UC Berkeley',
    points: 840,
    streak: 12,
    doubtsSolved: 28,
    tier: 'Scholar',
  },
  {
    rank: 5,
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'Carnegie Mellon',
    points: 790,
    streak: 7,
    doubtsSolved: 25,
    tier: 'Scholar',
  },
  {
    rank: 6,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    college: 'Harvard University',
    points: 720,
    streak: 6,
    doubtsSolved: 21,
    tier: 'Scholar',
  },
];

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [scope, setScope] = useState<'weekly' | 'allTime' | 'college'>('weekly');

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONOR ROLL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
            Scholars Leaderboard
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Top learners and solvers ranked by points, streak, and verified doubt answers.
          </p>
        </div>

        {/* Scope Tabs */}
        <div className="bg-[#F8F9FB] border border-[#E5E7EB] p-1 rounded-xl flex items-center self-start sm:self-auto">
          <button
            onClick={() => setScope('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === 'weekly'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setScope('allTime')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === 'allTime'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setScope('college')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === 'college'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            My Campus
          </button>
        </div>
      </div>

      {/* Top 3 Podium Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {/* Rank 2 (Silver) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-3 shadow-xs relative order-2 md:order-1">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-extrabold text-sm flex items-center justify-center mx-auto border border-gray-300">
            #2
          </div>
          <Avatar
            src={MOCK_LEADERS[1].avatar}
            name={MOCK_LEADERS[1].name}
            size="lg"
            className="mx-auto"
            ring="amber"
          />
          <div>
            <h4 className="text-sm font-extrabold text-[#151C2F]">{MOCK_LEADERS[1].name}</h4>
            <p className="text-xs text-[#667085]">{MOCK_LEADERS[1].college}</p>
          </div>
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-xs font-bold">
            <span className="text-[#0057BE]">{MOCK_LEADERS[1].points} pts</span>
            <span className="text-[#D97706] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {MOCK_LEADERS[1].streak}d
            </span>
          </div>
        </div>

        {/* Rank 1 (Gold) */}
        <div className="bg-gradient-to-b from-[#FFFBEB] to-white rounded-2xl border-2 border-[#F59E0B] p-7 text-center space-y-3.5 shadow-md relative order-1 md:order-2">
          <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-amber-400/30">
            <Crown className="w-5 h-5" />
          </div>
          <Avatar
            src={MOCK_LEADERS[0].avatar}
            name={MOCK_LEADERS[0].name}
            size="xl"
            className="mx-auto"
            ring="amber"
          />
          <div>
            <h4 className="text-base font-extrabold text-[#151C2F]">{MOCK_LEADERS[0].name}</h4>
            <p className="text-xs text-[#667085]">{MOCK_LEADERS[0].college}</p>
          </div>
          <div className="pt-2 border-t border-[#FDE68A] flex items-center justify-center gap-4 text-xs font-extrabold">
            <span className="text-[#0057BE] text-sm">{MOCK_LEADERS[0].points} pts</span>
            <span className="text-[#D97706] flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {MOCK_LEADERS[0].streak}d streak
            </span>
          </div>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-3 shadow-xs relative order-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 font-extrabold text-sm flex items-center justify-center mx-auto border border-amber-200">
            #3
          </div>
          <Avatar
            src={MOCK_LEADERS[2].avatar}
            name={MOCK_LEADERS[2].name}
            size="lg"
            className="mx-auto"
          />
          <div>
            <h4 className="text-sm font-extrabold text-[#151C2F]">{MOCK_LEADERS[2].name}</h4>
            <p className="text-xs text-[#667085]">{MOCK_LEADERS[2].college}</p>
          </div>
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-xs font-bold">
            <span className="text-[#0057BE]">{MOCK_LEADERS[2].points} pts</span>
            <span className="text-[#D97706] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {MOCK_LEADERS[2].streak}d
            </span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#151C2F]">Rankings Table</h3>
          <span className="text-xs text-[#667085]">Updated real-time every 15 minutes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FB] text-[#667085] font-bold border-b border-[#E5E7EB]">
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-4">Scholar</th>
                <th className="py-3.5 px-4">Institution</th>
                <th className="py-3.5 px-4">Daily Streak</th>
                <th className="py-3.5 px-4">Doubts Solved</th>
                <th className="py-3.5 px-5 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {MOCK_LEADERS.map((leader) => (
                <tr
                  key={leader.rank}
                  className={`transition-colors ${
                    leader.isCurrentUser
                      ? 'bg-[#EAF2FC]/60 font-semibold'
                      : 'hover:bg-[#F8F9FB]'
                  }`}
                >
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-extrabold ${
                        leader.rank === 1
                          ? 'bg-[#F59E0B] text-white'
                          : leader.rank === 2
                          ? 'bg-gray-200 text-gray-700'
                          : leader.rank === 3
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-[#667085]'
                      }`}
                    >
                      {leader.rank}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={leader.avatar} name={leader.name} size="sm" />
                      <div>
                        <div className="font-extrabold text-[#151C2F] flex items-center gap-1.5">
                          <span>{leader.name}</span>
                          {leader.isCurrentUser && (
                            <span className="text-[10px] bg-[#0057BE] text-white px-1.5 py-0.2 rounded font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#667085]">{leader.tier}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#475467] font-medium">{leader.college}</td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-[#D97706]">
                      <Flame className="w-3.5 h-3.5" />
                      {leader.streak} days
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#151C2F]">{leader.doubtsSolved}</td>

                  <td className="py-4 px-5 text-right font-extrabold text-[#0057BE] text-sm">
                    {leader.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
