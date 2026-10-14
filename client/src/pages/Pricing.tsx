import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const Pricing: React.FC = () => {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const proPrice = billingCycle === 'yearly' ? '$9.60' : '$12';
  const instPrice = billingCycle === 'yearly' ? '$39' : '$49';

  return (
    <div className="space-y-10 font-sans max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PLANS & MARKETPLACE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151C2F] tracking-tight">
          Invest in Your Academic Excellence
        </h1>
        <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
          Flexible plans designed for self-studying scholars, high-performing study circles, and university departments.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-[#F8F9FB] border border-[#E5E7EB] p-1 rounded-full flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#151C2F] shadow-xs'
                  : 'text-[#667085] hover:text-[#151C2F]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-[#0057BE] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#151C2F]'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] font-extrabold bg-[#F59E0B] text-[#151C2F] px-1.5 py-0.2 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {/* Basic Plan */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-xs">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Free Scholar
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#151C2F]">$0</span>
                <span className="text-xs text-[#667085]">/ forever</span>
              </div>
              <p className="text-xs text-[#667085] mt-2">
                Essential collaboration tools for independent students and casual study groups.
              </p>
            </div>

            <div className="border-t border-[#E5E7EB] pt-5 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Unlimited public study rooms</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Join real-time chat & timer sessions</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Ask up to 5 doubts per week</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Basic leaderboard tracking</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="mt-8 rounded-xl font-bold text-xs"
          >
            Your Current Plan
          </Button>
        </div>

        {/* Pro Scholar Plan (Navy Card - Most Popular) */}
        <div className="bg-[#151C2F] text-white rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-[#2D3748]">
          <div className="absolute top-0 right-0 bg-[#F59E0B] text-[#151C2F] text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            MOST POPULAR
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pro Scholar
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{proPrice}</span>
                <span className="text-xs text-gray-300">/ month</span>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                Accelerate learning with 2X bounty multipliers and unlimited AI tool suite.
              </p>
            </div>

            <div className="border-t border-white/10 pt-5 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">Unlimited AI Lecture Summaries & Flashcards</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">2X Doubt Bounty Points multiplier</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Create private password-protected rooms</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified Scholar Badge on profile & rankings</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority doubt matching with campus top 5%</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-8 rounded-xl font-extrabold text-xs bg-[#0057BE] hover:bg-[#00479E] text-white shadow-md shadow-blue-600/30"
            onClick={() => toast.success('Pro upgrade initiated! Welcome to Pro Scholar.', 'Upgrade Initiated')}
          >
            Upgrade to Pro Scholar
          </Button>
        </div>

        {/* Institutional Plan */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-xs">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                University Circle
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#151C2F]">{instPrice}</span>
                <span className="text-xs text-[#667085]">/ month</span>
              </div>
              <p className="text-xs text-[#667085] mt-2">
                Tailored for university student unions, study societies, and lab circles.
              </p>
            </div>

            <div className="border-t border-[#E5E7EB] pt-5 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Up to 50 member licenses included</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Departmental leaderboard integration</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>TA / Professor verified answer endorsements</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#151C2F]">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Dedicated Slack & Canvas LMS sync</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="mt-8 rounded-xl font-bold text-xs"
            onClick={() => toast.info('Campus coordinator has been notified. We will reach out shortly.', 'Campus Team Contacted')}
          >
            Contact Campus Team
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-6">
        <h3 className="text-xl font-extrabold text-[#151C2F]">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h5 className="font-bold text-[#151C2F]">Can I cancel my Pro subscription anytime?</h5>
            <p className="text-[#667085] leading-relaxed">
              Yes, you can cancel in one click from your account settings. You will retain Pro perks until the end of your billing cycle.
            </p>
          </div>
          <div className="space-y-1.5">
            <h5 className="font-bold text-[#151C2F]">Do doubt bounty points expire?</h5>
            <p className="text-[#667085] leading-relaxed">
              Never! All points earned by helping peers and solving doubts stay on your permanent scholar transcript.
            </p>
          </div>
          <div className="space-y-1.5">
            <h5 className="font-bold text-[#151C2F]">Is there a student discount?</h5>
            <p className="text-[#667085] leading-relaxed">
              Our Pro Scholar tier is already discounted by 60% compared to standard SaaS tools. Annual plans give you an additional 20% off.
            </p>
          </div>
          <div className="space-y-1.5">
            <h5 className="font-bold text-[#151C2F]">How does real-time room sync work?</h5>
            <p className="text-[#667085] leading-relaxed">
              StudySphere utilizes ultra-low latency WebSockets. When a room host starts or pauses a Pomodoro timer, all connected peers sync in under 50ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
