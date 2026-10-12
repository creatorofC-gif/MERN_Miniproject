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
  const defaultBuddies: Participant[] = [
    {
      name: 'Sarah J.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      status: 'focus',
    },
    {
      name: 'Mike T.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      status: 'break',
    },
    {
      name: 'Alex R.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      name: 'Elena G.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      status: 'active',
    },
  ];

  const displayList = participants.length > 0 ? participants : defaultBuddies;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
        <Video className="w-4 h-4 text-gray-300" />
        <span>Active Study Buddies</span>
      </div>

      <div className="flex items-center gap-3.5 overflow-x-auto pb-2">
        {displayList.map((buddy, idx) => {
          const isBreak = buddy.status === 'break';
          const isFocus = buddy.status === 'focus';

          return (
            <div
              key={idx}
              className="relative w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border border-[#374151] bg-[#1E293B] shrink-0 group transition-all"
            >
              {/* Thumbnail */}
              <img
                src={buddy.avatar}
                alt={buddy.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />

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
                </span>
              </div>
            </div>
          );
        })}

        {/* Invite Buddy Card */}
        <button
          onClick={onInviteBuddy || (() => alert('Invite link copied to clipboard: https://studysphere.io/join/calc2'))}
          className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-[#374151] hover:border-gray-400 bg-transparent flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">+ Invite</span>
        </button>
      </div>
    </div>
  );
};
