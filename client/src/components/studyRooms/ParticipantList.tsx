import React from 'react';
import { Video, Coffee, UserPlus } from 'lucide-react';
import { Participant } from '../../types';

export interface ParticipantListProps {
  participants?: Participant[];
  currentUserId?: string;
  onInviteBuddy?: () => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants = [],
  currentUserId,
  onInviteBuddy,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
        <Video className="w-4 h-4 text-gray-300" />
        <span>Active Study Buddies</span>
      </div>

      {participants.length === 0 ? (
        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1E293B]/60 border border-[#374151]/50 text-gray-400 text-xs">
          <span>No other study buddies in this room yet. Share the invite link to study together!</span>
          <button
            onClick={onInviteBuddy || (() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Room link copied to clipboard!');
            })}
            className="px-3 py-1.5 rounded-lg border border-dashed border-[#4B5563] hover:border-gray-300 text-gray-300 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ml-3"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Peers</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2">
          {participants.map((buddy, idx) => {
          const isBreak = buddy.status === 'break';
          const isFocus = buddy.status === 'focus';

          return (
            <div
              key={idx}
              className="relative w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border border-[#374151] bg-[#1E293B] shrink-0 group transition-all"
            >
              {/* Thumbnail or Initials Tile */}
              {buddy.avatar ? (
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#151C2F] text-gray-200">
                  <span className="text-base font-extrabold text-white tracking-wider">
                    {buddy.name
                      ? buddy.name
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'ST'}
                  </span>
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute top-2 right-2">
                {isBreak ? (
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs">
                    <Coffee className="w-3 h-3" />
                  </div>
                ) : isFocus ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-2 ring-[#1E293B]" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#1E293B]" />
                )}
              </div>

              {/* Name Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 px-2">
                <span className="text-xs font-semibold text-white truncate block">
                  {buddy.name}
                  {currentUserId && buddy.id === currentUserId ? ' (You)' : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Invite Buddy Card */}
        <button
          onClick={onInviteBuddy || (() => {
            navigator.clipboard?.writeText(window.location.href);
            alert('Room link copied to clipboard!');
          })}
          className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-[#374151] hover:border-gray-400 bg-transparent flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">+ Invite</span>
        </button>
      </div>
      )}
    </div>
  );
};
