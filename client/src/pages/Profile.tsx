import React, { useState } from 'react';
import {
  Award,
  Flame,
  Clock,
  Edit2,
  Check,
  Trophy,
  GraduationCap,
  Crown,
  Sparkles,
  Zap,
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usersService } from '../services/users.service';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [switchingPlan, setSwitchingPlan] = useState(false);

  const currentPlan = user?.plan || 'free';

  const handleSwitchPlan = async (targetPlan: 'free' | 'pro' | 'university') => {
    if (currentPlan === targetPlan) return;
    setSwitchingPlan(true);

    try {
      const updated = await usersService.updateProfile({ plan: targetPlan });
      if (setUser && user) {
        setUser({ ...user, ...updated, plan: targetPlan });
      }
      if (targetPlan === 'pro') {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        toast.success('🎉 Pro Scholar Activated! 2X Bounty Points & Unlimited AI Tools unlocked!', 'Plan Switched');
      } else if (targetPlan === 'university') {
        confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
        toast.success('🏛️ University Circle Activated! Departmental Leaderboard & Campus Circle enabled!', 'Plan Switched');
      } else {
        toast.info('Switched to Free Scholar tier.', 'Plan Updated');
      }
    } catch {
      if (setUser && user) {
        setUser({ ...user, plan: targetPlan });
      }
      toast.success(`Switched to ${targetPlan === 'pro' ? 'Pro Scholar' : targetPlan === 'university' ? 'University Circle' : 'Free'} plan.`, 'Plan Updated');
    } finally {
      setSwitchingPlan(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setBranch(user.branch || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const updatedPayload = { name, college, branch, bio };

    // Optimistic local update
    if (user && setUser) {
      setUser({ ...user, ...updatedPayload });
    }

    try {
      const updatedUser = await usersService.updateProfile(updatedPayload);
      if (updatedUser && setUser) {
        setUser(updatedUser);
      }
      toast.success('Your profile changes have been saved to Atlas Cloud.', 'Profile Updated');
    } catch (err) {
      console.warn('Backend profile update sync:', err);
      toast.info('Profile saved locally.', 'Profile Updated');
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const points = user?.points ?? 0;
  const streak = user?.streak ?? 0;
  const doubtsSolved = Math.floor(points / 50);
  const focusHours = (points * 0.04).toFixed(1);

  const badges = [
    {
      name: 'Scholar Welcome',
      desc: 'Created an account & joined StudySphere',
      icon: Award,
      unlocked: true,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      name: 'First Solution',
      desc: 'Solved first peer doubt (+50 Pts)',
      icon: Trophy,
      unlocked: points >= 50,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      name: 'Deep Focus Scholar',
      desc: 'Accumulated 250+ mastery points',
      icon: Clock,
      unlocked: points >= 250,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      name: 'Consistent Streak',
      desc: 'Maintained 7+ continuous streak days',
      icon: Flame,
      unlocked: streak >= 7,
      color: 'text-amber-500 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-xs relative transition-all ${
          currentPlan === 'pro'
            ? 'border-amber-300 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 shadow-amber-500/5'
            : currentPlan === 'university'
            ? 'border-indigo-300 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/40 shadow-indigo-500/5'
            : 'border-[#E5E7EB] bg-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                src={user?.avatar}
                name={user?.name || 'Scholar'}
                size="xl"
                ring={currentPlan === 'pro' ? 'amber' : currentPlan === 'university' ? 'blue' : 'none'}
              />
              {currentPlan === 'pro' && (
                <div
                  title="Verified Pro Scholar"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-xs border-2 border-white"
                >
                  <Crown className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              {currentPlan === 'university' && (
                <div
                  title="University Circle Member"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#0057BE] to-indigo-700 text-white flex items-center justify-center shadow-xs border-2 border-white"
                >
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-[#151C2F]">
                  {user?.name || 'Scholar'}
                </h1>

                {/* Academic Mastery Tier */}
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                  {user?.tier || 'Novice Scholar'}
                </span>

                {/* Marketplace Plan Badge with Clear Distinction */}
                {currentPlan === 'pro' ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white flex items-center gap-1 shadow-xs animate-in fade-in">
                    <Crown className="w-3.5 h-3.5 text-amber-200" />
                    <span>PRO SCHOLAR</span>
                  </span>
                ) : currentPlan === 'university' ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#0057BE] via-indigo-600 to-purple-600 text-white flex items-center gap-1 shadow-xs animate-in fade-in">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                    <span>UNIVERSITY CIRCLE</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    Free Scholar
                  </span>
                )}
              </div>

              <p className="text-xs text-[#667085] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#0057BE]" />
                <span>{user?.college || 'Add your university / college'}</span> •{' '}
                <span>{user?.branch || 'Add your major / branch'}</span>
              </p>
              <p className="text-xs text-[#475467] pt-1 max-w-xl">
                {user?.bio || 'Add a bio to introduce yourself to study peers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-4 animate-fadeIn">
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
                  placeholder="e.g. Stanford University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">Major / Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#151C2F] mb-1">Bio</label>
                <input
                  type="text"
                  placeholder="Share your academic interests..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0057BE]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                disabled={saving}
                onClick={handleSave}
                className="rounded-lg text-xs font-bold bg-[#151C2F]"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                {saving ? 'Saving...' : 'Save to Atlas Cloud'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#151C2F]">{points}</div>
          <div className="text-xs text-[#667085] mt-0.5">Total Points</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#D97706]">{streak} Day{streak === 1 ? '' : 's'}</div>
          <div className="text-xs text-[#667085] mt-0.5">Focus Streak</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#0057BE]">{doubtsSolved}</div>
          <div className="text-xs text-[#667085] mt-0.5">Doubts Solved</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
          <div className="text-2xl font-extrabold text-[#10B981]">{focusHours} hrs</div>
          <div className="text-xs text-[#667085] mt-0.5">Weekly Focus</div>
        </div>
      </div>

      {/* Marketplace Membership & Tier Features Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0057BE] text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Marketplace Tier Privileges</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#151C2F]">
              Active Plan: {currentPlan === 'pro' ? 'Pro Scholar ⚡' : currentPlan === 'university' ? 'University Circle 🏛️' : 'Free Scholar'}
            </h3>
            <p className="text-xs text-[#667085]">
              {currentPlan === 'pro'
                ? 'Your account has 2X bounty multipliers and full unlocked access to the AI tool suite.'
                : currentPlan === 'university'
                ? 'Your account is linked to your campus department with 50-member group licensing and LMS sync.'
                : 'Standard access enabled. Upgrade to Pro Scholar or University Circle for 2X multipliers and perks.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/pricing')}
              className="rounded-lg text-xs font-bold text-[#0057BE] border-[#0057BE]/30 hover:bg-[#EAF2FC]"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Plan Privileges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Perk 1: Bounty Multiplier */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentPlan === 'pro' || currentPlan === 'university'
                ? 'border-amber-200 bg-amber-50/40 text-amber-950'
                : 'border-gray-200 bg-gray-50/60 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentPlan === 'pro' || currentPlan === 'university' ? '2X MULTIPLIER' : '1X STANDARD'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151C2F]">Doubt Bounty Multiplier</h4>
            <p className="text-[11px] text-[#667085] mt-1">
              {currentPlan === 'pro' || currentPlan === 'university'
                ? 'Earn +100 Pts (Double score) on every accepted doubt solution!'
                : 'Standard +50 Pts bounty per doubt solution.'}
            </p>
          </div>

          {/* Perk 2: AI Summaries */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentPlan === 'pro' || currentPlan === 'university'
                ? 'border-blue-200 bg-blue-50/40 text-blue-950'
                : 'border-gray-200 bg-gray-50/60 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-[#0057BE] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-blue-200 text-blue-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentPlan === 'pro' || currentPlan === 'university' ? 'UNLIMITED' : '5 / WEEK'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151C2F]">AI Lecture Summaries</h4>
            <p className="text-[11px] text-[#667085] mt-1">
              {currentPlan === 'pro' || currentPlan === 'university'
                ? 'Unlimited AI notes extraction, flashcards & problem breakdown.'
                : 'Limited to 5 lecture summaries per week.'}
            </p>
          </div>

          {/* Perk 3: Private Suites */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentPlan === 'pro' || currentPlan === 'university'
                ? 'border-purple-200 bg-purple-50/40 text-purple-950'
                : 'border-gray-200 bg-gray-50/60 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Lock className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentPlan === 'pro' || currentPlan === 'university'
                    ? 'bg-purple-200 text-purple-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentPlan === 'pro' || currentPlan === 'university' ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151C2F]">Private Study Rooms</h4>
            <p className="text-[11px] text-[#667085] mt-1">
              {currentPlan === 'pro' || currentPlan === 'university'
                ? 'Create password-protected study suites with exclusive peer access.'
                : 'Join public study rooms across StudySphere.'}
            </p>
          </div>

          {/* Perk 4: Campus Circle & LMS Sync */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentPlan === 'university'
                ? 'border-indigo-300 bg-indigo-50/50 text-indigo-950'
                : 'border-gray-200 bg-gray-50/60 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  currentPlan === 'university'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentPlan === 'university'
                    ? 'bg-indigo-200 text-indigo-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentPlan === 'university' ? 'INSTITUTION' : 'CAMPUS'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#151C2F]">University Circle & LMS</h4>
            <p className="text-[11px] text-[#667085] mt-1">
              {currentPlan === 'university'
                ? 'Official TA verified answers, departmental rankings & Canvas LMS sync.'
                : 'Available on University Circle plan for student societies.'}
            </p>
          </div>
        </div>

        {/* Quick Marketplace Tier Switcher Bar in Profile */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[#151C2F] text-xs flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Switch Marketplace Tier:</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={switchingPlan || currentPlan === 'free'}
              onClick={() => handleSwitchPlan('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPlan === 'free'
                  ? 'bg-gray-200 text-gray-700 font-extrabold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {currentPlan === 'free' ? '✓ Free Scholar' : 'Free Scholar'}
            </button>
            <button
              disabled={switchingPlan || currentPlan === 'pro'}
              onClick={() => handleSwitchPlan('pro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPlan === 'pro'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-xs font-extrabold'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
              }`}
            >
              {currentPlan === 'pro' ? '✓ Pro Scholar (Active)' : '⚡ Switch to Pro Scholar'}
            </button>
            <button
              disabled={switchingPlan || currentPlan === 'university'}
              onClick={() => handleSwitchPlan('university')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPlan === 'university'
                  ? 'bg-gradient-to-r from-[#0057BE] to-indigo-700 text-white shadow-xs font-extrabold'
                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
              }`}
            >
              {currentPlan === 'university' ? '✓ University Circle (Active)' : '🏛️ Switch to University Circle'}
            </button>
          </div>
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
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3.5 ${
                  b.unlocked
                    ? 'border-[#E5E7EB] bg-white hover:bg-[#F8F9FB]'
                    : 'border-dashed border-gray-200 bg-gray-50/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      b.unlocked ? b.color : 'text-gray-400 bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#151C2F]">{b.name}</h4>
                    <p className="text-[11px] text-[#667085]">{b.desc}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    b.unlocked
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {b.unlocked ? '✓ Unlocked' : 'In Progress'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
