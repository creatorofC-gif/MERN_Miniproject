import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Waves, Play, Pause } from 'lucide-react';

export const AmbiancePlayer: React.FC = () => {
  const [isPlayingLofi, setIsPlayingLofi] = useState(true);
  const [isPlayingWhiteNoise, setIsPlayingWhiteNoise] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synthesize soft ambient sound using Web Audio API
  const startLofiSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create warm ambient chord
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.log('Audio init postponed until user interaction');
    }
  };

  const stopLofiSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  const toggleLofi = () => {
    if (isPlayingLofi) {
      stopLofiSound();
      setIsPlayingLofi(false);
    } else {
      startLofiSound();
      setIsPlayingLofi(true);
      if (isPlayingWhiteNoise) setIsPlayingWhiteNoise(false);
    }
  };

  const toggleWhiteNoise = () => {
    if (isPlayingWhiteNoise) {
      setIsPlayingWhiteNoise(false);
    } else {
      setIsPlayingWhiteNoise(true);
      if (isPlayingLofi) {
        stopLofiSound();
        setIsPlayingLofi(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopLofiSound();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Headphones className="w-4 h-4 text-[#151C2F]" />
        <h4 className="text-sm font-bold text-[#151C2F]">Ambiance</h4>
      </div>

      <div className="space-y-2.5">
        {/* Lofi Beats */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center">
              {isPlayingLofi ? (
                <div className="flex items-center gap-0.5 h-3.5">
                  <span className="w-0.5 h-3 bg-[#0057BE] animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#0057BE] animate-pulse delay-75" />
                  <span className="w-0.5 h-3.5 bg-[#0057BE] animate-pulse delay-150" />
                </div>
              ) : (
                <Waves className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-[#151C2F]">Lofi Beats</div>
              <div className="text-[10px] text-[#667085]">
                {isPlayingLofi ? 'Playing' : 'Paused'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleLofi}
            className="w-7 h-7 rounded-full bg-[#151C2F] text-white flex items-center justify-center hover:bg-[#1E293B] transition-colors"
          >
            {isPlayingLofi ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
          </button>
        </div>

        {/* White Noise */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#667085] flex items-center justify-center">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#151C2F]">White Noise</div>
              <div className="text-[10px] text-[#667085]">
                {isPlayingWhiteNoise ? 'Playing' : 'Off'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleWhiteNoise}
            className="w-7 h-7 rounded-full bg-[#F3F4F6] text-[#151C2F] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            {isPlayingWhiteNoise ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
