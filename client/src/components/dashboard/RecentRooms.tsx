import React from 'react';
import { NavLink } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StudyRoom } from '../../types';

export interface RecentRoomsProps {
  rooms?: StudyRoom[];
  onJoinRoom?: (roomId: string) => void;
}

export const RecentRooms: React.FC<RecentRoomsProps> = ({ rooms = [], onJoinRoom }) => {
  return (
    <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between h-64">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#151C2F]">Recent Rooms</h3>
          <NavLink
            to="/study-rooms"
            className="text-xs font-semibold text-[#0057BE] hover:underline"
          >
            View All
          </NavLink>
        </div>

        <div className="space-y-3">
          {rooms.length === 0 ? (
            <div className="py-7 text-center text-xs text-[#98A2B3]">
              <p>No active rooms right now.</p>
              <NavLink to="/study-rooms" className="text-[#0057BE] font-semibold hover:underline mt-1.5 inline-block">
                Create or explore study rooms
              </NavLink>
            </div>
          ) : (
            rooms.slice(0, 2).map((room) => (
              <NavLink
                key={room._id}
                to={`/study-rooms/${room._id}`}
                className="block p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#0057BE]/50 hover:bg-[#F8F9FB] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#151C2F] truncate">{room.name}</h4>
                  <Badge variant="live" size="sm" dot>
                    Live
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  {/* Overlapping small avatar circles */}
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-gray-300 border border-white" />
                    <div className="w-5 h-5 rounded-full bg-gray-400 border border-white" />
                    <span className="text-[11px] font-semibold text-[#667085] ml-2">
                      {room.participantCount || (room.participants ? room.participants.length : 1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#667085]">
                    <Headphones className="w-3.5 h-3.5 text-[#98A2B3]" />
                    <span>{room.vibe || 'Focus'}</span>
                  </div>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#98A2B3] text-center">
        Click any room to jump straight into deep work
      </p>
    </Card>
  );
};
