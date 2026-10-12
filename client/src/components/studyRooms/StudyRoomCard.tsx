import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, VolumeX, Mic } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AvatarGroup } from '../ui/AvatarGroup';
import { Button } from '../ui/Button';
import { StudyRoom } from '../../types';

export interface StudyRoomCardProps {
  room: StudyRoom;
  onJoin?: (id: string) => void;
}

export const StudyRoomCard: React.FC<StudyRoomCardProps> = ({ room, onJoin }) => {
  const navigate = useNavigate();

  const getVibeIcon = () => {
    switch (room.vibe) {
      case 'Deep Silence':
        return <VolumeX className="w-4 h-4 text-[#667085]" />;
      case 'Active Discussion':
        return <Mic className="w-4 h-4 text-[#667085]" />;
      case 'Lofi Beats':
      default:
        return <Headphones className="w-4 h-4 text-[#667085]" />;
    }
  };

  const isLive = room.status === 'live';

  const defaultAvatars = [
    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', name: 'Alex' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', name: 'Mike' },
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', name: 'Elena' },
  ];

  const displayAvatars = room.participants?.length > 0
    ? room.participants.map((p) => ({ src: p.avatar, name: p.name }))
    : defaultAvatars;

  const handleJoin = () => {
    const roomId = room._id || room.id || '';
    if (onJoin) {
      onJoin(roomId);
    } else {
      navigate(`/study-rooms/${roomId}`);
    }
  };

  return (
    <Card className="p-6 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] flex flex-col justify-between h-56 transition-all duration-200">
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          {isLive ? (
            <Badge variant="live" size="sm" dot>
              Live
            </Badge>
          ) : (
            <Badge variant="focus" size="sm" dot>
              Focus Mode
            </Badge>
          )}

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#667085]">
            {getVibeIcon()}
            <span>{room.vibe || 'Lofi Beats'}</span>
          </div>
        </div>

        {/* Room Title */}
        <h3 className="text-xl font-bold text-[#151C2F] tracking-tight mb-1.5 line-clamp-1">
          {room.name}
        </h3>

        {/* Room Description */}
        <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed">
          {room.description}
        </p>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <AvatarGroup
          items={displayAvatars}
          totalCount={room.participantCount || 6}
          max={3}
          size="sm"
        />

        <Button
          variant="primary"
          size="md"
          className="rounded-lg px-5 py-2 font-semibold bg-[#0057BE] hover:bg-[#004DA8]"
          onClick={handleJoin}
        >
          Join Room
        </Button>
      </div>
    </Card>
  );
};
