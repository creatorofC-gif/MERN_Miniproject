import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/users.service';
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

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [scope, setScope] = useState<'weekly' | 'allTime' | 'college'>('weekly');
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    usersService
      .getLeaderboard()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: LeaderboardUser[] = data.map((u: any, idx: number) => ({
            rank: idx + 1,
            name: u.name || 'Scholar',
            avatar: u.avatar || '',
            college: u.college || 'StudySphere Campus',
            points: u.points ?? 0,
            streak: u.streak ?? 0,
            doubtsSolved: Math.floor((u.points ?? 0) / 50),
            tier: u.tier || 'Novice Scholar',
            isCurrentUser: user?.name ? u.name.toLowerCase() === user.name.toLowerCase() : false,
          }));
          setLeaders(mapped);
        } else if (user) {
          // If only the current user exists in the system
          setLeaders([
            {
              rank: 1,
              name: user.name,
              avatar: user.avatar || '',
              college: user.college || 'StudySphere Campus',
              points: user.points ?? 0,
              streak: user.streak ?? 0,
              doubtsSolved: Math.floor((user.points ?? 0) / 50),
              tier: user.tier || 'Novice Scholar',
              isCurrentUser: true,
            },
          ]);
        } else {
          setLeaders([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch leaderboard:', err);
        if (user && isMounted) {
          setLeaders([
            {
              rank: 1,
              name: user.name,
              avatar: user.avatar || '',
              college: user.college || 'StudySphere Campus',
              points: user.points ?? 0,
              streak: user.streak ?? 0,
              doubtsSolved: Math.floor((user.points ?? 0) / 50),
              tier: user.tier || 'Novice Scholar',
              isCurrentUser: true,
            },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const first = leaders[0];
  const second = leaders[1];
  const third = leaders[2];

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONOR ROLL • REAL-TIME ATLAS CLOUD</span>
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
          {second ? (
            <>
              <Avatar
                src={second.avatar}
                name={second.name}
                size="lg"
                className="mx-auto"
                ring="amber"
              />
              <div>
                <h4 className="text-sm font-extrabold text-[#151C2F]">{second.name}</h4>
                <p className="text-xs text-[#667085]">{second.college}</p>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-xs font-bold">
                <span className="text-[#0057BE]">{second.points.toLocaleString()} pts</span>
                <span className="text-[#D97706] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {second.streak}d
                </span>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-1 text-xs text-[#98A2B3]">
              <div className="w-11 h-11 rounded-full bg-gray-100 mx-auto flex items-center justify-center font-bold text-gray-400">
                -
              </div>
              <p className="font-semibold text-gray-500">Awaiting Scholar</p>
              <p className="text-[11px]">Rank #2 is open to claim</p>
            </div>
          )}
        </div>

        {/* Rank 1 (Gold) */}
        <div className="bg-gradient-to-b from-[#FFFBEB] to-white rounded-2xl border-2 border-[#F59E0B] p-7 text-center space-y-3.5 shadow-md relative order-1 md:order-2">
          <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-amber-400/30">
            <Crown className="w-5 h-5" />
          </div>
          {first ? (
            <>
              <Avatar
                src={first.avatar}
                name={first.name}
                size="xl"
                className="mx-auto"
                ring="amber"
              />
              <div>
                <h4 className="text-base font-extrabold text-[#151C2F]">{first.name}</h4>
                <p className="text-xs text-[#667085]">{first.college}</p>
              </div>
              <div className="pt-2 border-t border-[#FDE68A] flex items-center justify-center gap-4 text-xs font-extrabold">
                <span className="text-[#0057BE] text-sm">{first.points.toLocaleString()} pts</span>
                <span className="text-[#D97706] flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {first.streak}d streak
                </span>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-1 text-xs text-[#98A2B3]">
              <div className="w-14 h-14 rounded-full bg-amber-50 mx-auto flex items-center justify-center font-bold text-amber-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-700">Rank #1 Open</p>
              <p className="text-[11px]">Solve doubts to take the top spot</p>
            </div>
          )}
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-3 shadow-xs relative order-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 font-extrabold text-sm flex items-center justify-center mx-auto border border-amber-200">
            #3
          </div>
          {third ? (
            <>
              <Avatar
                src={third.avatar}
                name={third.name}
                size="lg"
                className="mx-auto"
              />
              <div>
                <h4 className="text-sm font-extrabold text-[#151C2F]">{third.name}</h4>
                <p className="text-xs text-[#667085]">{third.college}</p>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-xs font-bold">
                <span className="text-[#0057BE]">{third.points.toLocaleString()} pts</span>
                <span className="text-[#D97706] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {third.streak}d
                </span>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-1 text-xs text-[#98A2B3]">
              <div className="w-11 h-11 rounded-full bg-gray-100 mx-auto flex items-center justify-center font-bold text-gray-400">
                -
              </div>
              <p className="font-semibold text-gray-500">Awaiting Scholar</p>
              <p className="text-[11px]">Rank #3 is open to claim</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#151C2F]">Rankings Table</h3>
          <span className="text-xs text-[#667085]">
            {loading ? 'Updating live stats...' : `${leaders.length} Scholar${leaders.length === 1 ? '' : 's'} ranked`}
          </span>
        </div>

        <div className="overflow-x-auto">
          {leaders.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#98A2B3] space-y-2">
              <Trophy className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-600">No scholars ranked on the leaderboard yet.</p>
              <p>Complete study sessions and answer doubts to claim rank #1!</p>
            </div>
          ) : (
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
                {leaders.map((leader) => {
                  return (
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
                          {leader.streak} day{leader.streak === 1 ? '' : 's'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-[#151C2F]">{leader.doubtsSolved}</td>

                      <td className="py-4 px-5 text-right font-extrabold text-[#0057BE] text-sm">
                        {leader.points.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
