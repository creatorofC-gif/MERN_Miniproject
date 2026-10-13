import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Clock,
  CheckCircle2,
  Trophy,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudyRoom, Doubt } from '../types';
import { roomService } from '../services/rooms.service';
import { doubtService } from '../services/doubts.service';
import { StatCard } from '../components/dashboard/StatCard';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { RecentRooms } from '../components/dashboard/RecentRooms';
import { LatestDoubts } from '../components/dashboard/LatestDoubts';
import { Button } from '../components/ui/Button';
import { CreateRoomModal } from '../components/studyRooms/CreateRoomModal';
import { AskDoubtModal } from '../components/doubts/AskDoubtModal';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [askDoubtOpen, setAskDoubtOpen] = useState(false);
  const [recentRooms, setRecentRooms] = useState<StudyRoom[]>([]);
  const [latestDoubts, setLatestDoubts] = useState<Doubt[]>([]);

  useEffect(() => {
    roomService.getRooms().then(setRecentRooms).catch(() => {});
    doubtService.getDoubts().then(setLatestDoubts).catch(() => {});
  }, []);

  const currentPoints = user?.points ?? 0;
  const currentStreak = user?.streak ?? 0;
  const doubtsSolved = Math.floor(currentPoints / 50);
  const focusHours = (currentPoints * 0.04).toFixed(1);
  const targetPoints = 1000;
  const progressPercent = Math.min(Math.round((currentPoints / targetPoints) * 100), 100);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
            Welcome, {user?.name || 'Scholar'}! 👋
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            {currentPoints === 0
              ? 'Your brand new dashboard is ready! Jump into a study room or solve doubts to build your mastery score.'
              : `Great momentum! You currently have ${currentPoints} mastery points and a ${currentStreak}-day focus streak.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            className="rounded-lg text-xs font-bold"
            onClick={() => setAskDoubtOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ask Doubt
          </Button>

          <Button
            variant="dark"
            size="md"
            className="rounded-lg text-xs font-bold bg-[#151C2F] hover:bg-[#1E293B]"
            onClick={() => setCreateRoomOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Room
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Active Streak"
          value={`${currentStreak} Day${currentStreak === 1 ? '' : 's'}`}
          subtitle={currentStreak > 0 ? 'Consecutive focus streak' : 'Start day 1 today'}
          icon={Flame}
          trend={currentStreak > 0 ? '+1 day' : 'New'}
          color="amber"
        />
        <StatCard
          title="Weekly Focus"
          value={`${focusHours} hrs`}
          subtitle="Total logged focus time"
          icon={Clock}
          trend={Number(focusHours) > 0 ? `+${focusHours}h` : '0h'}
          color="blue"
        />
        <StatCard
          title="Doubts Solved"
          value={String(doubtsSolved)}
          subtitle={doubtsSolved > 0 ? 'Verified solutions provided' : 'Solve doubts to earn points'}
          icon={CheckCircle2}
          trend={doubtsSolved > 0 ? `+${doubtsSolved}` : 'Start'}
          color="purple"
        />
        <StatCard
          title="Bounty Points"
          value={currentPoints.toLocaleString()}
          subtitle={user?.tier || 'Novice Scholar'}
          icon={Trophy}
          trend={`+${currentPoints} pts`}
          color="green"
        />
      </div>

      {/* Journey to Mentor / Level Progress Banner */}
      <div className="bg-gradient-to-r from-[#151C2F] to-[#1E293B] text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#0057BE]/20 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Journey to Master Scholar</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {targetPoints > currentPoints
                ? `You are ${targetPoints - currentPoints} points away from Scholar Rank Level 2`
                : 'Congratulations! You have reached Master Tier'}
            </h3>
            <p className="text-xs text-gray-300">
              Answer doubts or complete focused study sessions in collaborative rooms to earn rank multipliers.
            </p>
          </div>

          <div className="lg:w-80 w-full space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-300">Level 4 Progress</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0057BE] via-[#3B82F6] to-[#F59E0B] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>{currentPoints} pts</span>
              <span>{targetPoints} pts (Master)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Recent Study Rooms & Latest Doubts */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent / Recommended Study Rooms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#151C2F]">Active Study Rooms</h2>
                <p className="text-xs text-[#667085]">Peer focus sessions currently in progress</p>
              </div>
              <button
                onClick={() => navigate('/study-rooms')}
                className="text-xs font-bold text-[#0057BE] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Rooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <RecentRooms rooms={recentRooms} onJoinRoom={(roomId) => navigate(`/study-rooms/${roomId}`)} />
          </div>

          {/* Latest Academic Doubts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#151C2F]">Urgent Doubts in Your Subjects</h2>
                <p className="text-xs text-[#667085]">Help peers unstuck and earn reward bounties</p>
              </div>
              <button
                onClick={() => navigate('/doubts')}
                className="text-xs font-bold text-[#0057BE] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Doubts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <LatestDoubts doubts={latestDoubts} onSelectDoubt={(doubtId) => navigate(`/doubts?id=${doubtId}`)} />
          </div>
        </div>

        {/* Right Column (4 cols): Daily Goals & Weekly Routine */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Goals Card */}
          <DailyGoals />

          {/* Mini Study Tip Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0057BE]">
              <Target className="w-4 h-4" />
              <span>Recommended Today</span>
            </div>
            <h4 className="text-sm font-bold text-[#151C2F]">Calculus II Sprint • 4:00 PM</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              3 of your study circle buddies (Elena, Marcus, Priya) have reserved seats for the Fourier Transforms session.
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="text-xs font-bold rounded-lg mt-1"
              onClick={() => navigate('/study-rooms/calc2-deep-work')}
            >
              Reserve Seat
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={createRoomOpen}
        onClose={() => setCreateRoomOpen(false)}
      />
      <AskDoubtModal
        isOpen={askDoubtOpen}
        onClose={() => setAskDoubtOpen(false)}
      />
    </div>
  );
};
