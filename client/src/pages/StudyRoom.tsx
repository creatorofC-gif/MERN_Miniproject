import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import {
  ArrowLeft,
  Share2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudyRoom as StudyRoomType, ChatMessage, Participant } from '../types';
import { roomService } from '../services/rooms.service';
import { StudyTimer } from '../components/studyRooms/StudyTimer';
import { AmbiancePlayer } from '../components/studyRooms/AmbiancePlayer';
import { RoomChat } from '../components/studyRooms/RoomChat';
import { ParticipantList } from '../components/studyRooms/ParticipantList';
import { Button } from '../components/ui/Button';

export const StudyRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<StudyRoomType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [alertBanner, setAlertBanner] = useState<{ sender: string; title: string } | null>(null);
  const [roomChatTab, setRoomChatTab] = useState<'chat' | 'doubts'>('chat');
  const [externalSync, setExternalSync] = useState<{
    action: string;
    timeRemaining: number;
    isRunning: boolean;
    mode?: string;
  } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Fetch initial room data from API
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    roomService
      .getRoomById(id)
      .then((data) => {
        if (data) {
          setRoom(data);
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
          if (data.participants && data.participants.length > 0) {
            setParticipants(data.participants);
            setLiveCount(data.participants.length);
          }
        } else {
          setError('Study room could not be found.');
        }
      })
      .catch((err) => {
        console.error('Failed to load room:', err);
        setError(err?.message || 'Study room not found or database unavailable.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  // Connect WebSockets for Real-Time synchronization
  useEffect(() => {
    if (!id || !room) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (window.location.port === '5173' ? 'http://localhost:5000' : '/');
    const authToken = localStorage.getItem('studysphere_token');

    // Connect to backend Socket.IO
    const socket = io(socketUrl, {
      auth: authToken ? { token: authToken } : undefined,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[Socket] Connected to server: ${socket.id}`);
      socket.emit('join_room', {
        roomId: id,
        userName: user?.name || 'Student',
        userAvatar:
          user?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    });

    // Listen to real-time chat messages
    socket.on('new_message', (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    // Listen to room presence updates (user joins/leaves)
    socket.on('room_presence_update', ({ count, members }: { count: number; members: any[] }) => {
      if (count !== undefined) {
        setLiveCount(count);
      }
      if (members) {
        const mappedParticipants: Participant[] = members.map((m: any, idx: number) => ({
          id: m.socketId || `p-${idx}`,
          name: m.userName || 'Student',
          avatar:
            m.userAvatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isMuted: true,
          status: m.status || 'focus',
          studyHours: 0,
        }));
        setParticipants(mappedParticipants);
      }
    });

    // Listen to synchronized Pomodoro timer events from peers
    socket.on('timer_sync', (syncData: { action: string; timeRemaining: number; isRunning: boolean; mode?: string }) => {
      setExternalSync(syncData);
    });

    // Listen to live doubt raised popup alert
    socket.on('doubt_alert_popup', (alertData: { senderName: string; title: string }) => {
      setAlertBanner({ sender: alertData.senderName, title: alertData.title });
      setTimeout(() => {
        setAlertBanner(null);
      }, 7000);
    });

    // Listen to real-time doubt replies from peers in this room
    socket.on('room_doubt_replied', ({ doubtId, reply }: { doubtId: string; reply: any }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === doubtId || (msg as any).doubtId === doubtId) {
            const replies = msg.doubtReplies || [];
            return {
              ...msg,
              doubtReplies: [...replies, reply],
            };
          }
          return msg;
        })
      );
    });

    // Listen to real-time doubt resolution from peers in this room
    socket.on('room_doubt_resolved', ({ doubtId }: { doubtId: string }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === doubtId || (msg as any).doubtId === doubtId) {
            return {
              ...msg,
              isResolved: true,
            };
          }
          return msg;
        })
      );
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
      socket.off('room_presence_update');
      socket.off('timer_sync');
      socket.off('doubt_alert_popup');
      socket.off('room_doubt_replied');
      socket.off('room_doubt_resolved');
      socket.disconnect();
    };
  }, [id, room, user]);

  // Send Chat Message via Socket
  const handleSendMessage = (text: string, type: 'message' | 'doubt_alert' = 'message') => {
    if (!socketRef.current || !id) return;

    const payload = {
      roomId: id,
      senderName: user?.name || 'Student',
      senderAvatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      senderName: user?.name || 'Student',
      title: doubtTitle,
    });
  };

  // Reply to Room Doubt via Socket
  const handleReplyDoubt = (doubtId: string, text: string) => {
    if (!socketRef.current || !id) return;
    socketRef.current.emit('reply_room_doubt', {
      roomId: id,
      doubtId,
      text,
    });
  };

  // Mark Room Doubt Resolved via Socket
  const handleResolveDoubt = (doubtId: string) => {
    if (!socketRef.current || !id) return;
    socketRef.current.emit('resolve_room_doubt', {
      roomId: id,
      doubtId,
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-10 h-10 border-4 border-[#0057BE] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Loading Study Room...</h2>
        <p className="text-sm text-gray-500 mt-1">Connecting to workspace and peers</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white dark:bg-[#151C2F] rounded-2xl p-8 border border-gray-200 dark:border-[#1E293B] text-center shadow-lg">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Room Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">
          {error || 'The study room you are trying to access does not exist or could not be loaded.'}
        </p>
        <Button onClick={() => navigate('/study-rooms')} variant="primary" className="mx-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Study Rooms
        </Button>
      </div>
    );
  }

  const roomName = room.name;
  const roomSubject = room.subject;

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
                <span>LIVE • {liveCount} Active Scholar{liveCount === 1 ? '' : 's'}</span>
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
            onClick={() => setRoomChatTab('doubts')}
            className="px-3.5 py-1.5 rounded-lg bg-[#F59E0B] text-white text-xs font-bold hover:bg-[#D97706] cursor-pointer shadow-xs"
          >
            Help Answer in Room
          </button>
        </div>
      )}

      {/* Prominent Active Study Buddies Bar */}
      <div className="bg-[#151C2F] text-white p-5 rounded-2xl border border-[#1E293B] shadow-sm">
        <ParticipantList
          participants={participants}
          currentUserId={user?.id}
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
            externalSync={externalSync}
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
            onReplyDoubt={handleReplyDoubt}
            onResolveDoubt={handleResolveDoubt}
            currentUserId={user?.id}
            activeTab={roomChatTab}
            onTabChange={setRoomChatTab}
          />
        </div>
      </div>
    </div>
  );
};
