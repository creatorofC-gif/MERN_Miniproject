import React, { useState } from 'react';
import { Clock, CheckCircle2, ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Doubt } from '../../types';
import { doubtsService } from '../../services/doubts.service';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export interface DoubtCardProps {
  doubt: Doubt;
  onRefresh?: () => void;
  onUpvote?: (doubtId: string) => void;
  onAddAnswer?: (doubtId: string, answerText: string) => void;
  isHighlighted?: boolean;
}

export const DoubtCard: React.FC<DoubtCardProps> = ({
  doubt,
  onRefresh,
  onUpvote,
  onAddAnswer,
  isHighlighted,
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [upvotes, setUpvotes] = useState(doubt.upvotes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(doubt.status === 'claimed' || doubt.status === 'solved');
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async () => {
    if (hasVoted) return;
    setUpvotes((prev) => prev + 1);
    setHasVoted(true);
    try {
      await doubtsService.voteDoubt(doubt._id);
    } catch (e) {}
  };

  const handleClaim = async () => {
    setIsClaimed(true);
    setIsExpanded(true);
    try {
      await doubtsService.claimDoubt(doubt._id, user?.name || 'Alex Mercer');
    } catch (e) {}
  };

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setSubmitting(true);
    try {
      await doubtsService.addAnswer(doubt._id, {
        content: answerContent.trim(),
        authorName: user?.name || 'Alex Mercer',
        authorAvatar: user?.avatar,
      });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setAnswerContent('');
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      borderAccent={doubt.isUrgent ? 'red' : 'none'}
      className="p-6 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all space-y-4"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={doubt.authorAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'}
            name={doubt.authorName}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#151C2F]">{doubt.authorName}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                {doubt.authorTier || 'Scholar'}
              </span>
            </div>
            <span className="text-xs text-[#98A2B3]">Posted 2 mins ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="amber" size="md">
            +{doubt.pointsReward || 50} Pts
          </Badge>

          {doubt.isUrgent && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold border border-[#FFE4E6]">
              <Clock className="w-3 h-3" />
              <span>AI Help in 04:30</span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-[#151C2F] leading-snug">
        {doubt.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[#475467] leading-relaxed">
        {doubt.description}
      </p>

      {/* Code snippet if present */}
      {doubt.codeSnippet && (
        <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-3.5 font-mono text-xs text-[#151C2F] overflow-x-auto">
          <pre>{doubt.codeSnippet}</pre>
        </div>
      )}

      {/* Footer Tags & Claim & Solve Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {doubt.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563]"
            >
              {tag}
            </span>
          ))}

          <button
            onClick={handleVote}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              hasVoted ? 'bg-[#EAF2FC] text-[#0057BE]' : 'hover:bg-gray-100 text-[#667085]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{upvotes}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="dark"
            size="sm"
            className="rounded-lg px-4 py-2 font-semibold bg-[#151C2F] hover:bg-[#1E293B]"
            onClick={handleClaim}
          >
            {isClaimed ? 'Solve Now' : 'Claim & Solve'}
          </Button>

          {doubt.answers?.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-[#667085] hover:text-[#151C2F] rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Answers & Solution Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          <h4 className="text-xs font-bold text-[#151C2F] uppercase tracking-wider">
            Discussion & Answers ({doubt.answers?.length || 0})
          </h4>

          {doubt.answers?.map((ans, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={ans.authorAvatar} name={ans.authorName} size="xs" />
                  <span className="text-xs font-bold text-[#151C2F]">{ans.authorName}</span>
                  <span className="text-[10px] text-[#667085]">{ans.authorTier}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#059669] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">{ans.content}</p>
            </div>
          ))}

          {/* Add Answer Form */}
          <form onSubmit={handleAddAnswer} className="space-y-2">
            <textarea
              rows={3}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your step-by-step solution to earn mastery points..."
              className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none focus:border-[#0057BE] focus:ring-2 focus:ring-[#0057BE]/15"
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Solution (+Mastery)'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};
