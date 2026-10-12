import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StudyTimerProps {
  onTimerSync?: (action: string, time: number, isRunning: boolean) => void;
  onTimerAction?: (action: string, time: number, isRunning: boolean, mode: string) => void;
  externalSync?: { action: string; timeRemaining: number; isRunning: boolean; mode?: string } | null;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ onTimerSync, onTimerAction, externalSync }) => {
  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const initialTime = mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60;

  // React to remote WebSocket timer synchronization
  useEffect(() => {
    if (externalSync) {
      if (externalSync.action === 'start') {
        setIsRunning(true);
        if (externalSync.timeRemaining) setSecondsLeft(externalSync.timeRemaining);
      } else if (externalSync.action === 'pause') {
        setIsRunning(false);
        if (externalSync.timeRemaining) setSecondsLeft(externalSync.timeRemaining);
      } else if (externalSync.action === 'reset') {
        setIsRunning(false);
        setSecondsLeft(externalSync.timeRemaining || 25 * 60);
      } else if (externalSync.action === 'skip') {
        const nextMode = mode === 'focus' ? 'short_break' : 'focus';
        setMode(nextMode);
        setSecondsLeft(externalSync.timeRemaining || (nextMode === 'focus' ? 25 * 60 : 5 * 60));
        setIsRunning(true);
      }
    }
  }, [externalSync]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (onTimerSync) onTimerSync(nextState ? 'start' : 'pause', secondsLeft, nextState);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(initialTime);
    if (onTimerSync) onTimerSync('reset', initialTime, false);
  };

  const skipTimer = () => {
    const nextMode = mode === 'focus' ? 'short_break' : 'focus';
    const nextTime = nextMode === 'focus' ? 25 * 60 : 5 * 60;
    setMode(nextMode);
    setSecondsLeft(nextTime);
    setIsRunning(true);
    if (onTimerSync) onTimerSync('skip', nextTime, true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((initialTime - secondsLeft) / initialTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      {/* Timer Circle */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
        {/* SVG Circular Progress Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-[#2D3748]"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-[#8B5CF6] transition-all duration-300"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 105}
            strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-xs font-bold text-[#8B5CF6] tracking-widest mt-2 uppercase">
            {mode === 'focus' ? 'FOCUSING' : 'RECHARGING'}
          </span>
        </div>
      </div>

      {/* Control Buttons matching Figma Screenshot */}
      <div className="flex items-center gap-4 mt-8">
        {/* Reset button */}
        <button
          onClick={resetTimer}
          title="Reset timer"
          className="w-11 h-11 rounded-full bg-[#2A3449] hover:bg-[#36425C] text-gray-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play/Pause Purple Pill */}
        <button
          onClick={toggleTimer}
          className="px-7 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Focus</span>
            </>
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={skipTimer}
          title="Skip session"
          className="w-11 h-11 rounded-full bg-[#2A3449] hover:bg-[#36425C] text-gray-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
