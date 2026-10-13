import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Users, Sparkles, RefreshCw } from 'lucide-react';
import { StudyRoom } from '../types';
import { roomService } from '../services/rooms.service';
import { StudyRoomCard } from '../components/studyRooms/StudyRoomCard';
import { CreateRoomModal } from '../components/studyRooms/CreateRoomModal';
import { Button } from '../components/ui/Button';

const SUBJECT_PILLS = [
  'All Subjects',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
];

export const StudyRooms: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSubject =
      selectedSubject === 'All Subjects' ||
      room.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-7 font-sans">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
            Active Study Rooms
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Join peer rooms or create your own focus environment with real-time sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={fetchRooms}
            className="rounded-lg text-xs font-semibold p-2.5"
            title="Refresh rooms"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="dark"
            size="md"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg text-xs font-bold bg-[#151C2F] hover:bg-[#1E293B]"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Room
          </Button>
        </div>
      </div>

      {/* Search & Subject Category Filter Pills */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="text"
            placeholder="Search by subject, room topic, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] hover:border-[#D0D5DD] focus:border-[#0057BE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none shadow-xs transition-all"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUBJECT_PILLS.map((pill) => {
            const isActive = selectedSubject === pill;
            return (
              <button
                key={pill}
                onClick={() => setSelectedSubject(pill)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0057BE] text-white shadow-xs'
                    : 'bg-white text-[#667085] border border-[#E5E7EB] hover:border-[#D0D5DD] hover:text-[#151C2F]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4 animate-pulse h-60"
            >
              <div className="flex justify-between">
                <div className="w-20 h-5 bg-gray-200 rounded-full" />
                <div className="w-16 h-5 bg-gray-200 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-gray-200 rounded-md" />
              <div className="w-full h-12 bg-gray-100 rounded-md" />
              <div className="w-full h-8 bg-gray-200 rounded-md mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#151C2F]">No rooms found</h3>
            <p className="text-xs text-[#667085]">
              No active study rooms match "{searchQuery || selectedSubject}". Be the first to start one!
            </p>
          </div>
          <Button
            variant="dark"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-lg text-xs font-bold mx-auto"
          >
            Create This Study Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <StudyRoomCard
              key={room._id || room.id}
              room={room}
              onJoin={(id) => navigate(`/study-rooms/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newRoom) => {
          setRooms((prev) => [newRoom, ...prev]);
        }}
      />
    </div>
  );
};
