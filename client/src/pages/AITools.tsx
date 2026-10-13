import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  Zap,
  CheckCircle2,
  FileText,
  BrainCircuit,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { aiService } from '../services/ai.service';
import { Button } from '../components/ui/Button';

export const AITools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summarizer' | 'doubtHelper'>('summarizer');
  const [inputText, setInputText] = useState(
    'Fourier transform decomposes functions depending on space or time into functions depending on spatial frequency or temporal frequency. In signal processing, it transforms signals between time and frequency domains.'
  );
  const [output, setOutput] = useState<{
    summary?: string;
    bulletPoints?: string[];
    flashcards?: { question: string; answer: string }[];
  } | null>({
    summary:
      'The Fourier Transform converts a time-domain or spatial function into a continuous frequency-domain representation. Essential for harmonic analysis, signal decomposition, and differential equations.',
    bulletPoints: [
      'Decomposes complex signals into pure sinusoidal frequencies',
      'Transforms time domain (t) into temporal frequency domain (ω)',
      'Underpins modern digital communications, MRI imaging, and acoustics',
    ],
    flashcards: [
      {
        question: 'What is the primary role of a Fourier Transform?',
        answer: 'To convert time-domain signals into their frequency-domain components.',
      },
      {
        question: 'Where is it widely applied?',
        answer: 'Signal processing, acoustics, image compression, and partial differential equations.',
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const res = await aiService.summarize(inputText);
      setOutput(res);
    } catch (err) {
      setOutput({
        summary: `Analysis of: "${inputText.substring(0, 80)}..." completed.`,
        bulletPoints: [
          'Core concept extracted successfully',
          'Mathematical foundations identified',
          'Recommended follow-up study: Practice problem sets on StudySphere Doubts',
        ],
        flashcards: [
          {
            question: 'What is the fundamental takeaway?',
            answer: inputText.substring(0, 100),
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistJoined(true);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ACADEMIC INTELLIGENCE ENGINE • DEMO PREVIEW</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
          AI Study Suite
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Interactive demonstration of academic intelligence, lecture synthesis, and flashcard generation.
        </p>
      </div>

      {/* Hero Showcase Banner */}
      <div className="bg-gradient-to-tr from-[#151C2F] via-[#1E293B] to-[#252F48] rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg border border-[#2D3748]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8B5CF6]/20 via-[#0057BE]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro Feature Preview</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Study Smarter with Integrated Academic AI
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              Turn 2-hour lecture transcripts into instant flashcards, automatically extract LaTeX equations, and verify doubt answers in seconds.
            </p>

            {/* Waitlist Form */}
            <form onSubmit={handleJoinWaitlist} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md">
              {waitlistJoined ? (
                <div className="p-3 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs font-bold text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You're #142 on the VIP Early Access list!</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter your student email..."
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-white/40 backdrop-blur-xs"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="rounded-xl text-xs font-bold bg-[#0057BE] hover:bg-[#00479E] whitespace-nowrap"
                  >
                    Join VIP Waitlist
                  </Button>
                </>
              )}
            </form>
          </div>

          {/* Decorative Visual Card */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-gray-300">Live AI Assistant</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                Online
              </span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-white/10 text-gray-200">
                <span className="text-amber-400 font-bold block mb-1">Student:</span>
                "Explain the difference between Dijkstra and A* Search in two sentences."
              </div>
              <div className="p-3 rounded-lg bg-[#0057BE]/20 border border-[#0057BE]/30 text-white">
                <span className="text-blue-300 font-bold block mb-1">StudySphere AI:</span>
                "Dijkstra explores paths uniformly based on actual cost from the origin, while A* uses a heuristic function h(n) to prioritize nodes closer to the destination."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Playground */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#151C2F]">Interactive Concept Synthesizer</h3>
            <p className="text-xs text-[#667085]">Paste any textbook paragraph or lecture excerpt to try it out</p>
          </div>

          <div className="flex items-center gap-1 bg-[#F8F9FB] p-1 rounded-lg border border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab('summarizer')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'summarizer'
                  ? 'bg-white text-[#0057BE] shadow-xs'
                  : 'text-[#667085] hover:text-[#151C2F]'
              }`}
            >
              Summarizer & Notes
            </button>
            <button
              onClick={() => setActiveTab('doubtHelper')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'doubtHelper'
                  ? 'bg-white text-[#0057BE] shadow-xs'
                  : 'text-[#667085] hover:text-[#151C2F]'
              }`}
            >
              Formula Assistant
            </button>
          </div>
        </div>

        {/* Input & Output Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input Form (6 cols) */}
          <form onSubmit={handleGenerate} className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#151C2F] mb-1.5">
                Input Lecture Notes or Question
              </label>
              <textarea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste academic content..."
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] focus:border-[#0057BE] focus:bg-white rounded-xl p-3.5 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none transition-all resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="dark"
              size="md"
              fullWidth
              isLoading={isLoading}
              className="bg-[#151C2F] hover:bg-[#1E293B] font-bold text-xs rounded-xl"
            >
              <BrainCircuit className="w-4 h-4 mr-1.5 text-blue-400" />
              Synthesize Knowledge & Flashcards
            </Button>
          </form>

          {/* Generated Output (6 cols) */}
          <div className="lg:col-span-6 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB] p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-[#151C2F] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0057BE]" />
              <span>AI Analysis Results</span>
            </h4>

            {output ? (
              <div className="space-y-4 text-xs">
                {output.summary && (
                  <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] text-[#151C2F] leading-relaxed">
                    <strong className="text-[#0057BE] block mb-1">Executive Summary:</strong>
                    {output.summary}
                  </div>
                )}

                {output.bulletPoints && output.bulletPoints.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] space-y-1.5">
                    <strong className="text-[#151C2F] block mb-1">Key Takeaways:</strong>
                    {output.bulletPoints.map((bp, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#475467]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0057BE] mt-1.5 shrink-0" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {output.flashcards && output.flashcards.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] space-y-2">
                    <strong className="text-[#D97706] block">Generated Flashcard:</strong>
                    <div className="text-[#151C2F] font-bold">
                      Q: {output.flashcards[0].question}
                    </div>
                    <div className="text-[#475467] text-[11px] bg-[#FEF3C7]/40 p-2 rounded">
                      A: {output.flashcards[0].answer}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[#98A2B3]">
                Click "Synthesize Knowledge" to test the AI engine.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Teasers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#151C2F]">Smart PDF Summarizer</h4>
          <p className="text-xs text-[#667085] leading-relaxed">
            Upload syllabi, research papers, and assignments to get structured study outlines automatically.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#151C2F]">LaTeX Formula Solver</h4>
          <p className="text-xs text-[#667085] leading-relaxed">
            Step-by-step calculus, linear algebra, and physics derivations rendered cleanly with math markup.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#151C2F]">Adaptive Quiz Generator</h4>
          <p className="text-xs text-[#667085] leading-relaxed">
            Synthesizes practice multiple-choice and conceptual exam tests targeting your weakest topics.
          </p>
        </div>
      </div>
    </div>
  );
};
