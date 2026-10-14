import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Play, Flame, Users, Trophy, HelpCircle, Sparkles, Plus, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#151C2F]">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#151C2F] flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-xl text-[#151C2F] tracking-tight">StudySphere</span>
        </NavLink>



        <div className="flex items-center gap-4">
          <NavLink
            to="/login"
            className="text-sm font-bold text-[#151C2F] hover:text-[#0057BE] transition-colors"
          >
            Sign In
          </NavLink>
          <Button
            variant="dark"
            size="md"
            className="rounded-lg bg-[#151C2F] hover:bg-[#1E293B] font-bold"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-bold uppercase tracking-wider">
              NEXT–GEN LEARNING PLATFORM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#151C2F] leading-[1.12] tracking-tight">
              Transform Your Study Sessions into a{' '}
              <span className="text-[#0057BE]">Collaborative</span>{' '}
              <span className="text-[#F59E0B]">Adventure</span>
            </h1>

            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
              Experience deep focus and community support. Join virtual study rooms, conquer difficult concepts with peers, and earn real rewards as you level up your academic journey.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="dark"
                size="lg"
                className="bg-[#151C2F] hover:bg-[#1E293B] font-bold text-sm px-6 py-3 rounded-lg"
                onClick={() => navigate('/dashboard')}
              >
                Start Studying Now
              </Button>

              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current ml-0.5 text-[#151C2F]" />}
                className="font-bold text-sm px-6 py-3 rounded-lg text-[#151C2F] border border-[#E5E7EB]"
                onClick={() => navigate('/study-rooms')}
              >
                See How It Works
              </Button>
            </div>
          </div>

          {/* Hero Right Image / Graphic */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-100 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80"
                alt="Students studying collaboratively"
                className="w-full h-full object-cover"
              />

              {/* Floating Live Pill */}
              <div className="absolute inset-x-6 bottom-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#151C2F]">
                    5,204 Students Focusing Right Now
                  </h4>
                  <p className="text-xs text-[#667085]">
                    Join a live room to boost your productivity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151C2F] tracking-tight">
            Everything you need to master your subjects
          </h2>
          <p className="text-base text-[#667085]">
            Built on cognitive science and gamification principles to keep you engaged, focused, and progressing every single day.
          </p>
        </div>

        {/* 4 Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Virtual Study Rooms (7 cols) */}
          <div className="md:col-span-7 bg-gradient-to-br from-white to-[#F8F9FB] rounded-2xl border border-[#E5E7EB] p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#151C2F] mb-2">Virtual Study Rooms</h3>
              <p className="text-sm text-[#667085] leading-relaxed max-w-md">
                Join immersive, distraction-free zones. Sync up with peers globally, match your focus timers, and hold each other accountable through shared presence.
              </p>
            </div>

            {/* Mini preview card */}
            <div className="mt-8 bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E0E7FF] text-[#3730A3] font-bold text-xs flex items-center justify-center">
                  AL
                </div>
                <div>
                  <div className="text-xs font-bold text-[#151C2F]">Deep Work Session</div>
                  <div className="text-[11px] font-semibold text-[#8B5CF6]">45:00 Focus Mode</div>
                </div>
              </div>
              <Button
                variant="dark"
                size="sm"
                className="bg-[#151C2F] text-xs font-bold px-4"
                onClick={() => navigate('/study-rooms')}
              >
                Join Room
              </Button>
            </div>
          </div>

          {/* Card 2: Gamified Rewards (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-white to-[#FFFBEB]/40 rounded-2xl border border-[#E5E7EB] p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#151C2F] mb-2">Gamified Rewards</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Level up as you learn. Earn badges, track streaks, and climb the Scholar Leaderboard to unlock premium perks.
              </p>
            </div>

            {/* Mini preview tier */}
            <div className="mt-8 bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs">
              <div className="flex justify-between text-xs font-bold text-[#151C2F] mb-2">
                <span className="text-[#B45309]">SCHOLAR TIER</span>
                <span>2400 / 3000 XP</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#0057BE] via-[#F59E0B] to-[#F59E0B] h-full rounded-full w-4/5" />
              </div>
            </div>
          </div>

          {/* Card 3: Live Doubt Engine (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-white to-[#FFF5F5]/40 rounded-2xl border border-[#E5E7EB] p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#151C2F] mb-2">Live Doubt Engine</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Stuck on a problem? Post it as an 'Urgent Bounty'. Mentors and peers can jump in instantly to help solve it collaboratively.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate('/doubts')}
                className="w-full py-2.5 rounded-xl border border-[#F26161] text-[#F26161] font-bold text-xs hover:bg-[#FFF5F5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Bounty</span>
              </button>
            </div>
          </div>

          {/* Card 4: AI-Powered Summaries (8 cols) */}
          <div className="md:col-span-8 bg-gradient-to-br from-white to-[#FAF5FF] rounded-2xl border border-[#E5E7EB] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="max-w-md">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#151C2F] mb-2">AI–Powered Summaries</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Our built-in AI instantly generates concise study notes, flashcards, and quizzes from your uploaded materials or live discussion transcripts.
              </p>
            </div>

            <div className="w-full md:w-64 bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
              <div className="space-y-2">
                <div className="h-2.5 bg-gray-200 rounded-full w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full" />
                <div className="h-2.5 bg-gray-200 rounded-full w-5/6" />
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-[11px] font-bold">
                  <Zap className="w-3 h-3 fill-current" /> Flashcards Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-[#F8F9FB] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#151C2F]">StudySphere</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#667085]">
            <a href="#privacy" className="hover:text-[#151C2F]">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#151C2F]">Terms of Service</a>
            <a href="#contact" className="hover:text-[#151C2F]">Contact Us</a>
            <a href="#discord" className="hover:text-[#151C2F]">Discord Community</a>
          </div>

          <div className="text-xs text-[#98A2B3]">
            © 2024 StudySphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
