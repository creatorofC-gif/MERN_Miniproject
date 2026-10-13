import React, { useState } from 'react';
import {
  User as UserIcon,
  Award,
  Flame,
  Clock,
  BookOpen,
  Edit2,
  Check,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [bio, setBio] = useState(user?.bio || '');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setBranch(user.branch || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = () => {
    if (user && setUser) {
      setUser({
        ...user,
        name,
        college,
        branch,
        bio,
      });
    }
    setIsEditing(false);
  };

  const badges = [
    { name: '14-Day Streak', desc: 'Maintained continuous focus streak', icon: Flame, color: 'text-amber-500 bg-amber-50' },
    { name: 'Calculus Champion', desc: 'Solved 25+ integration & derivative doubts', icon: Award, color: 'text-blue-500 bg-blue-50' },
    { name: 'Top 5% Solver', desc: 'Ranked in university upper percentile', icon: Trophy, color: 'text-purple-500 bg-purple-50' },
    { name: 'Deep Work Master', desc: 'Logged 25+ hours of Pomodoro focus', icon: Clock, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Scholar'}
              size="xl"
              ring="amber"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#151C2F]">
                  {user?.name || 'Scholar'}
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                  {user?.tier || 'Master Tier'}
                </span>
              </div>
              <p className="text-xs text-[#667085] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{user?.college || 'Stanford University'}</span> •{' '}
                <span>{user?.branch || 'Computer Science & Math'}</span>
              </p>
              <p className="text-xs text-[#475467] pt-1 max-w-xl">{user?.bio}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg text-xs font-bold"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">University / College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">Major / Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
            </div>
            <Button
              variant="dark"
              size="sm"
              onClick={handleSave}
              className="rounded-lg text-xs font-bold bg-[#151C2F]"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#151C2F]">{user?.points || 1250}</div>
          <div className="text-xs text-[#667085] mt-0.5">Total Points</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#D97706]">{user?.streak || 14} Days</div>
          <div className="text-xs text-[#667085] mt-0.5">Focus Streak</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#0057BE]">42</div>
          <div className="text-xs text-[#667085] mt-0.5">Doubts Solved</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#10B981]">28.5 hrs</div>
          <div className="text-xs text-[#667085] mt-0.5">Weekly Focus</div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-extrabold text-[#151C2F]">Scholar Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-[#E5E7EB] flex items-center gap-3.5 hover:bg-[#F8F9FB] transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#151C2F]">{b.name}</h4>
                  <p className="text-[11px] text-[#667085]">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
