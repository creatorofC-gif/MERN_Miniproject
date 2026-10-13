import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  HelpCircle,
  Trophy,
  Filter,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Doubt } from '../types';
import { doubtService } from '../services/doubts.service';
import { DoubtCard } from '../components/doubts/DoubtCard';
import { SolverLeaderboard } from '../components/doubts/SolverLeaderboard';
import { AskDoubtModal } from '../components/doubts/AskDoubtModal';
import { Button } from '../components/ui/Button';

const FILTER_PILLS = ['All Doubts', 'High Reward', 'Needs Review', 'Unanswered'];

export const Doubts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('All Doubts');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [askModalOpen, setAskModalOpen] = useState<boolean>(false);

  const fetchDoubts = async () => {
    setIsLoading(true);
    try {
      const data = await doubtService.getDoubts();
      setDoubts(data);
    } catch (err) {
      console.error('Failed to load doubts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const handleUpvote = async (doubtId: string) => {
    try {
      const res = await doubtService.upvoteDoubt(doubtId);
      setDoubts((prev) =>
        prev.map((d) => ((d._id === doubtId || d.id === doubtId) ? { ...d, upvotes: res.upvotes } : d))
      );
    } catch (err) {
      console.error('Failed to upvote doubt:', err);
    }
  };

  const handleAddAnswer = async (doubtId: string, answerText: string) => {
    try {
      const updated = await doubtService.addAnswer(doubtId, answerText);
      setDoubts((prev) => prev.map((d) => ((d._id === doubtId || d.id === doubtId) ? updated : d)));
    } catch (err) {
      console.error('Failed to post answer:', err);
    }
  };

  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSubject =
      selectedSubject === 'All' ||
      doubt.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (activeFilter === 'High Reward') {
      matchesFilter = (doubt.bountyPoints || doubt.pointsReward || 0) >= 40;
    } else if (activeFilter === 'Unanswered') {
      matchesFilter = doubt.answers.length === 0;
    } else if (activeFilter === 'Needs Review') {
      matchesFilter = !doubt.isResolved;
    }

    return matchesSubject && matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-7 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
            Academic Doubts
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Get un-stuck fast with peer explanations & earn bounty points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={fetchDoubts}
            className="rounded-lg text-xs font-semibold p-2.5"
            title="Refresh doubts"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="dark"
            size="md"
            onClick={() => setAskModalOpen(true)}
            className="rounded-lg text-xs font-bold bg-[#151C2F] hover:bg-[#1E293B]"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Post a Doubt
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="text"
              placeholder="Search questions, concepts, formulas, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] hover:border-[#D0D5DD] focus:border-[#0057BE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none shadow-xs transition-all"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white border border-[#E5E7EB] hover:border-[#D0D5DD] focus:border-[#0057BE] rounded-xl px-4 py-2.5 text-xs text-[#151C2F] outline-none shadow-xs font-semibold cursor-pointer"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0057BE] text-white shadow-xs'
                    : 'bg-white text-[#667085] border border-[#E5E7EB] hover:border-[#D0D5DD] hover:text-[#151C2F]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Doubt Cards */}
        <div className="lg:col-span-8 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4 animate-pulse h-48"
                >
                  <div className="flex justify-between">
                    <div className="w-24 h-5 bg-gray-200 rounded-md" />
                    <div className="w-16 h-5 bg-gray-200 rounded-md" />
                  </div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded-md" />
                  <div className="w-full h-12 bg-gray-100 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredDoubts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#151C2F]">No doubts found</h3>
                <p className="text-xs text-[#667085]">
                  No questions match your current filter criteria.
                </p>
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setAskModalOpen(true)}
                className="rounded-lg text-xs font-bold mx-auto"
              >
                Ask This Doubt
              </Button>
            </div>
          ) : (
            filteredDoubts.map((doubt) => (
              <DoubtCard
                key={doubt._id || doubt.id}
                doubt={doubt}
                onUpvote={handleUpvote}
                onAddAnswer={handleAddAnswer}
                isHighlighted={highlightedId === (doubt._id || doubt.id)}
              />
            ))
          )}
        </div>

        {/* Right Column (4 cols): Solver Leaderboard & Bounty Perks */}
        <div className="lg:col-span-4 space-y-6">
          <SolverLeaderboard />

          {/* Bounty Perks Explainer Card */}
          <div className="bg-gradient-to-br from-[#151C2F] to-[#1E293B] text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Trophy className="w-4 h-4" />
              <span>Bounty Economy</span>
            </div>
            <h4 className="text-base font-bold text-white">How Doubt Points Work</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              When peers accept your verified answer, you receive the full bounty value (+50 to +150 pts), boosting your rank toward University Mentor status.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-300 font-semibold">
              <span>Next Payout Tier</span>
              <span className="text-amber-400 font-bold">Gold Scholar (1,500 pts)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Doubt Modal */}
      <AskDoubtModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        onCreated={(newDoubt) => {
          setDoubts((prev) => [newDoubt, ...prev]);
        }}
      />
    </div>
  );
};
