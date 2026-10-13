import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Trophy,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Doubt, Answer } from '../../types';
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
  const { user, awardPoints } = useAuth();

  const [answers, setAnswers] = useState<Answer[]>(doubt.answers || []);
  const [status, setStatus] = useState<'open' | 'claimed' | 'solved'>(doubt.status || 'open');
  const [isResolved, setIsResolved] = useState<boolean>(
    Boolean(doubt.isResolved || doubt.status === 'solved')
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(
    (doubt.answers && doubt.answers.length > 0) || Boolean(isHighlighted)
  );
  const [answerContent, setAnswerContent] = useState('');
  const [upvotes, setUpvotes] = useState(doubt.upvotes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(
    doubt.status === 'claimed' || doubt.status === 'solved'
  );
  const [submitting, setSubmitting] = useState(false);
  const [masteryAward, setMasteryAward] = useState<{
    pointsEarned: number;
    newTotal: number;
  } | null>(null);

  const handleVote = async () => {
    if (hasVoted) return;
    setUpvotes((prev) => prev + 1);
    setHasVoted(true);
    try {
      await doubtsService.voteDoubt(doubt._id || doubt.id!);
      onUpvote?.(doubt._id || doubt.id!);
    } catch (e) {
      // Vote optimistic update already shown
    }
  };

  const handleClaim = async () => {
    setIsClaimed(true);
    setIsExpanded(true);
    try {
      await doubtsService.claimDoubt(doubt._id || doubt.id!, user?.name || 'Scholar');
    } catch (e) {
      // Local claimed state already set
    }
  };

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = answerContent.trim();
    if (!content) return;

    const pointsEarned = doubt.bountyPoints || doubt.pointsReward || 50;
    const currentPoints = user?.points || 0;
    const newTotal = currentPoints + pointsEarned;

    const newAns: Answer = {
      _id: `ans-${Date.now()}`,
      authorName: user?.name || 'Scholar',
      authorAvatar: user?.avatar || '',
      authorTier: user?.tier || 'Scholar Tier',
      content,
      isAccepted: true,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistically append new answer to conversation thread
    setAnswers((prev) => [...prev, newAns]);

    // 2. Mark doubt as solved and resolved
    setStatus('solved');
    setIsResolved(true);
    setIsClaimed(true);

    // 3. Show Mastery Award banner
    setMasteryAward({ pointsEarned, newTotal });

    // 4. Update global mastery points in AuthContext
    awardPoints(pointsEarned);

    // 5. Fire celebratory confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
    });

    // 6. Reset form and ensure thread is expanded
    setAnswerContent('');
    setIsExpanded(true);

    // 7. Notify parent component
    onAddAnswer?.(doubt._id || doubt.id!, content);

    // 8. Persist to API
    setSubmitting(true);
    try {
      await doubtsService.addAnswer(doubt._id || doubt.id!, {
        content,
        authorName: user?.name || 'Scholar',
        authorAvatar: user?.avatar,
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.warn('Backend sync for answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const bountyValue = doubt.bountyPoints || doubt.pointsReward || 50;

  return (
    <Card
      borderAccent={doubt.isUrgent && !isResolved ? 'red' : 'none'}
      className={`p-6 bg-white border transition-all space-y-4 shadow-2xs ${
        isHighlighted
          ? 'border-[#0057BE] ring-2 ring-[#0057BE]/20'
          : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={
              doubt.authorAvatar ||
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
            }
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
            <span className="text-xs text-[#98A2B3]">
              {doubt.createdAt
                ? new Date(doubt.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isResolved ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-extrabold border border-[#A7F3D0]">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Resolved</span>
            </span>
          ) : (
            <Badge variant="amber" size="md">
              +{bountyValue} Pts
            </Badge>
          )}

          {doubt.isUrgent && !isResolved && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold border border-[#FFE4E6]">
              <Clock className="w-3 h-3" />
              <span>Urgent</span>
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

      {/* Mastery Score Award Celebratory Banner */}
      {masteryAward && (
        <div className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#0D9488] text-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl shadow-inner">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Mastery Points Awarded!
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-black text-xs">
                  +{masteryAward.pointsEarned} Pts
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Doubt is marked as <span className="font-bold underline decoration-white">Resolved</span>! Your updated mastery score is <span className="font-black text-white">{masteryAward.newTotal} pts</span>.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold bg-white text-[#059669] px-3 py-1.5 rounded-lg shadow-2xs whitespace-nowrap">
            ✓ Solution Accepted
          </span>
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
          {isResolved ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved • View Thread ({answers.length})</span>
            </button>
          ) : (
            <Button
              variant="dark"
              size="sm"
              className="rounded-lg px-4 py-2 font-semibold bg-[#151C2F] hover:bg-[#1E293B]"
              onClick={handleClaim}
            >
              {isClaimed ? 'Solve Now' : 'Claim & Solve'}
            </Button>
          )}

          {answers.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-[#667085] hover:text-[#151C2F] rounded-lg hover:bg-gray-100 cursor-pointer"
              title="Toggle answers thread"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Answers & Solution Thread Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#151C2F] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#0057BE]" />
              <span>Discussion Thread ({answers.length} {answers.length === 1 ? 'Response' : 'Responses'})</span>
            </h4>
            {isResolved && (
              <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                ✓ Thread Solved
              </span>
            )}
          </div>

          {answers.length === 0 ? (
            <div className="p-4 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] text-center text-xs text-[#667085]">
              No responses posted yet. Be the first to answer and claim the <strong>+{bountyValue} Pts</strong> mastery bounty!
            </div>
          ) : (
            answers.map((ans, idx) => (
              <div
                key={ans._id || idx}
                className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                  ans.isAccepted
                    ? 'bg-[#F0FDF4] border-[#86EFAC]/80'
                    : 'bg-[#F8F9FB] border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={ans.authorAvatar}
                      name={ans.authorName}
                      size="xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#151C2F]">{ans.authorName}</span>
                        <span className="text-[10px] text-[#667085] bg-gray-100 px-1.5 py-0.2 rounded">
                          {ans.authorTier || 'Scholar'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#98A2B3]">
                        {ans.createdAt
                          ? new Date(ans.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                    </div>
                  </div>

                  {ans.isAccepted && (
                    <div className="flex items-center gap-1 text-[11px] text-[#059669] font-bold bg-white px-2 py-0.5 rounded-full border border-[#86EFAC] shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Solution</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#1F2937] leading-relaxed pl-1 whitespace-pre-wrap font-medium">
                  {ans.content}
                </p>
              </div>
            ))
          )}

          {/* Add Answer Form */}
          <form onSubmit={handleAddAnswer} className="space-y-2.5 pt-2">
            <textarea
              rows={3}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your step-by-step solution to help peer and earn mastery score..."
              className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none focus:border-[#0057BE] focus:ring-2 focus:ring-[#0057BE]/15 font-sans"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Close Thread
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting || !answerContent.trim()}
                className="bg-[#0057BE] hover:bg-[#00469B] font-bold"
              >
                {submitting ? 'Submitting...' : `Submit Response (+${bountyValue} Mastery)`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};
