import { Server, Socket } from 'socket.io';
import { StudyRoom } from '../models/StudyRoom.js';

interface RoomUser {
  socketId: string;
  roomId: string;
  userName: string;
  userAvatar: string;
  status: 'focus' | 'break' | 'active';
  joinedAt: Date;
}

// Default active mock peers in study circles
const DEFAULT_ROOM_PEERS = [
  {
    socketId: 'peer-1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'focus' as const,
    joinedAt: new Date(),
  },
  {
    socketId: 'peer-2',
    userName: 'Mike Torres',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'break' as const,
    joinedAt: new Date(),
  },
  {
    socketId: 'peer-3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'focus' as const,
    joinedAt: new Date(),
  },
  {
    socketId: 'peer-4',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'active' as const,
    joinedAt: new Date(),
  },
];

// Active connected users keyed by socket id
const activeUsers = new Map<string, RoomUser>();

export const setupRoomSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Connected: ${socket.id}`);

    // Join Study Room
    socket.on('join_room', async ({ roomId, userName, userAvatar }) => {
      socket.join(roomId);

      const user: RoomUser = {
        socketId: socket.id,
        roomId,
        userName: userName || 'Student',
        userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'focus',
        joinedAt: new Date(),
      };

      activeUsers.set(socket.id, user);

      // Collect all active users currently in this room + mock buddies
      const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === roomId);
      const combinedMembers = [
        ...realRoomMembers,
        ...DEFAULT_ROOM_PEERS.map((p) => ({ ...p, roomId })),
      ];

      // Broadcast active presence and count to all clients in this room
      io.to(roomId).emit('room_presence_update', {
        count: combinedMembers.length,
        members: combinedMembers,
      });

      // Send system welcome message to peers
      socket.to(roomId).emit('new_message', {
        _id: `sys-${Date.now()}`,
        senderName: 'System',
        senderAvatar: '',
        text: `${user.userName} joined the focus room.`,
        type: 'system',
        createdAt: new Date().toISOString(),
      });
    });

    // Send Chat Message
    socket.on('send_message', async ({ roomId, senderName, senderAvatar, text, type }) => {
      const message = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        senderName: senderName || 'Student',
        senderAvatar: senderAvatar || '',
        text,
        type: type || 'message',
        createdAt: new Date().toISOString(),
      };

      // Broadcast immediately to everyone in the room (including sender)
      io.to(roomId).emit('new_message', message);

      // Persist to MongoDB StudyRoom if valid ObjectId
      try {
        if (roomId && !roomId.startsWith('calc2') && !roomId.startsWith('new-')) {
          await StudyRoom.findByIdAndUpdate(roomId, {
            $push: { messages: message },
          });
        }
      } catch (err) {
        // Continue seamlessly
      }
    });

    // Raise Live Doubt inside Study Room
    socket.on('raise_doubt_alert', async ({ roomId, senderName, title }) => {
      const alertMessage = {
        _id: `alert-${Date.now()}`,
        senderName: 'Live Doubt Raised',
        senderAvatar: '',
        text: title,
        type: 'doubt_alert',
        createdAt: new Date().toISOString(),
      };

      io.to(roomId).emit('new_message', alertMessage);
      io.to(roomId).emit('doubt_alert_popup', {
        senderName,
        title,
        timestamp: new Date().toISOString(),
      });
    });

    // Sync Pomodoro Timer across all participants in the room
    socket.on('timer_action', ({ roomId, action, timeRemaining, isRunning, mode }) => {
      socket.to(roomId).emit('timer_sync', {
        action,
        timeRemaining,
        isRunning,
        mode,
        triggeredBy: activeUsers.get(socket.id)?.userName || 'Peer',
      });
    });

    // Typing Indicators
    socket.on('typing', ({ roomId, userName, isTyping }) => {
      socket.to(roomId).emit('user_typing_update', { userName, isTyping });
    });

    // Buddy Status Updates (e.g. going on break, returning to focus)
    socket.on('update_status', ({ roomId, status }) => {
      const user = activeUsers.get(socket.id);
      if (user) {
        user.status = status;
        const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === roomId);
        const combinedMembers = [
          ...realRoomMembers,
          ...DEFAULT_ROOM_PEERS.map((p) => ({ ...p, roomId })),
        ];
        io.to(roomId).emit('room_presence_update', {
          count: combinedMembers.length,
          members: combinedMembers,
        });
      }
    });

    // Disconnect / Leave
    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        const { roomId, userName } = user;
        activeUsers.delete(socket.id);

        const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === roomId);
        const combinedMembers = [
          ...realRoomMembers,
          ...DEFAULT_ROOM_PEERS.map((p) => ({ ...p, roomId })),
        ];

        io.to(roomId).emit('room_presence_update', {
          count: combinedMembers.length,
          members: combinedMembers,
        });

        io.to(roomId).emit('new_message', {
          _id: `sys-${Date.now()}`,
          senderName: 'System',
          senderAvatar: '',
          text: `${userName} left the session.`,
          type: 'system',
          createdAt: new Date().toISOString(),
        });
      }
      console.log(`[WebSocket] Disconnected: ${socket.id}`);
    });
  });
};
