import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import {
  ArrowLeft,
  Users,
  Volume2,
  VolumeX,
  Share2,
  AlertCircle,
  Sparkles,
  BookOpen,
  LogOut,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudyRoom as StudyRoomType, ChatMessage, Participant } from '../types';
import { roomService } from '../services/rooms.service';
import { StudyTimer } from '../components/studyRooms/StudyTimer';
import { AmbiancePlayer } from '../components/studyRooms/AmbiancePlayer';
import { RoomChat } from '../components/studyRooms/RoomChat';
import { ParticipantList } from '../components/studyRooms/ParticipantList';
import { Button } from '../components/ui/Button';

const INITIAL_MOCK_BUDDIES: Participant[] = [
  {
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'focus',
    studyHours: 3.2,
  },
  {
    name: 'Mike Torres',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'break',
    studyHours: 2.1,
  },
  {
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'focus',
    studyHours: 4.5,
  },
  {
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    studyHours: 1.8,
  },
];

const INITIAL_MOCK_MESSAGES: ChatMessage[] = [
  {
    _id: 'msg-init-1',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    text: 'Hey everyone! Starting my 50min deep work sprint here 📚',
    type: 'message',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg-init-2',
    senderName: 'Mike Torres',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    text: 'Grabbing a quick coffee then back to problem set 3 ☕',
    type: 'message',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg-init-3',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    text: 'Let me know if anyone wants to compare integration derivations!',
    type: 'message',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

export const StudyRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<StudyRoomType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MOCK_MESSAGES);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_MOCK_BUDDIES);
  const [liveCount, setLiveCount] = useState<number>(5);
  const [alertBanner, setAlertBanner] = useState<{ sender: string; title: string } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Fetch initial room data
  useEffect(() => {
    if (!id) return;

    roomService.getRoomById(id).then((data) => {
      if (data) {
        setRoom(data);
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
        if (data.participants && data.participants.length > 0) {
          setParticipants(data.participants);
          setLiveCount(data.participants.length);
        }
      }
    });
  }, [id]);

  // Connect WebSockets for Real-Time synchronization
  useEffect(() => {
    if (!id) return;

    // Connect to backend Socket.IO
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[Socket] Connected to server: ${socket.id}`);
      socket.emit('join_room', {
        roomId: id,
        userName: user?.name || 'Alex Mercer',
        userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    });

    // Listen to real-time chat messages
    socket.on('new_message', (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    // Listen to room presence updates (user joins/leaves)
    socket.on('room_presence_update', ({ count, members }: { count: number; members: any[] }) => {
      if (count !== undefined) {
        setLiveCount(Math.max(count, 4));
      }
      if (members && members.length > 0) {
        const mappedParticipants: Participant[] = members.map((m: any, idx: number) => ({
          id: m.socketId || `p-${idx}`,
          name: m.userName,
          avatar: m.userAvatar,
          isMuted: true,
          status: m.status || 'focus',
          studyHours: 2.5,
        }));
        setParticipants(mappedParticipants);
      }
    });

    // Listen to live doubt raised popup alert
    socket.on('doubt_alert_popup', (alertData: { senderName: string; title: string }) => {
      setAlertBanner({ sender: alertData.senderName, title: alertData.title });
      setTimeout(() => {
        setAlertBanner(null);
      }, 7000);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, user]);

  // Send Chat Message via Socket
  const handleSendMessage = (text: string, type: 'message' | 'doubt_alert' = 'message') => {
    if (!socketRef.current || !id) return;

    const payload = {
      roomId: id,
      senderName: user?.name || 'Alex Mercer',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text,
      type,
    };

    socketRef.current.emit('send_message', payload);
  };

  // Raise Live Doubt via Socket
  const handleRaiseDoubt = (doubtTitle: string) => {
    if (!socketRef.current || !id) return;

    socketRef.current.emit('raise_doubt_alert', {
      roomId: id,
      senderName: user?.name || 'Alex Mercer',
      title: doubtTitle,
    });
  };

  // Sync Timer with Peers
  const handleTimerAction = (action: string, timeRemaining: number, isRunning: boolean, mode: string) => {
    if (!socketRef.current || !id) return;

    socketRef.current.emit('timer_action', {
      roomId: id,
      action,
      timeRemaining,
      isRunning,
      mode,
    });
  };

  const roomName = room?.name || id?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Calculus II Deep Work';
  const roomSubject = room?.subject || 'Mathematics';

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Top Session Bar */}
      <div className="bg-[#151C2F] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/study-rooms')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Back to Study Rooms"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0057BE] text-white">
                {roomSubject}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>LIVE • {liveCount} Active Scholars</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {roomName}
            </h1>
          </div>
        </div>

        {/* Room Header Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Room link copied to clipboard!');
            }}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Peers</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/study-rooms')}
            className="text-xs font-bold border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Leave Room
          </Button>
        </div>
      </div>

      {/* Real-time Live Doubt Banner if raised */}
      {alertBanner && (
        <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-xl shadow-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#92400E]">
                {alertBanner.sender} just raised an urgent academic doubt in this session:
              </p>
              <p className="text-sm font-extrabold text-[#151C2F]">
                "{alertBanner.title}"
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/doubts`)}
            className="px-3 py-1.5 rounded-lg bg-[#F59E0B] text-white text-xs font-bold hover:bg-[#D97706] cursor-pointer"
          >
            Help Answer
          </button>
        </div>
      )}

      {/* Prominent Active Study Buddies Bar (greets the user when opening room) */}
      <div className="bg-[#151C2F] text-white p-5 rounded-2xl border border-[#1E293B] shadow-sm">
        <ParticipantList
          participants={participants}
          currentUserId={user?.id || 'usr_1'}
        />
      </div>

      {/* Main Study Room Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Timer & Ambiance Audio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Synchronized Pomodoro Study Timer */}
          <StudyTimer
            onTimerAction={(action, time, running, mode) => {
              handleTimerAction(action, time, running, mode);
            }}
          />

          {/* Background Focus Ambiance Player */}
          <AmbiancePlayer />
        </div>

        {/* Right Column (5 cols): Live Socket Chat */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Chat & Doubt Alert tabs */}
          <RoomChat
            messages={messages}
            onSendMessage={handleSendMessage}
            onRaiseDoubt={handleRaiseDoubt}
          />
        </div>
      </div>
    </div>
  );
};
