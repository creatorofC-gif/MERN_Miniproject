import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { StudyRoom } from '../models/StudyRoom.js';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../config/jwt.js';

interface RoomUser {
  socketId: string;
  roomId: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  status: 'focus' | 'break' | 'active';
  joinedAt: Date;
}

// Active connected users keyed by socket id
const activeUsers = new Map<string, RoomUser>();

// Per-socket message rate-limiting tracking
const messageTimestamps = new Map<string, number[]>();

const checkRateLimit = (socketId: string, limit = 5, windowMs = 2000): boolean => {
  const now = Date.now();
  const timestamps = (messageTimestamps.get(socketId) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  messageTimestamps.set(socketId, timestamps);
  return true;
};

export const setupRoomSocket = (io: Server): void => {
  // Socket authentication middleware
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
        socket.data.user = decoded;
      } catch (err) {
        // Token invalid or expired - proceed as unauthenticated guest
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Connected: ${socket.id}`);

    // Join Study Room
    socket.on('join_room', async (data: { roomId?: string; userName?: string; userAvatar?: string }) => {
      const roomId = typeof data?.roomId === 'string' ? data.roomId.trim() : '';
      if (!roomId || roomId.length > 100) return;

      socket.join(roomId);

      let userName = 'Student';
      let userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      const authUserId = socket.data.user?.id;

      if (authUserId) {
        try {
          const dbUser = await User.findById(authUserId);
          if (dbUser) {
            userName = dbUser.name;
            userAvatar = dbUser.avatar;
          }
        } catch {
          // If database is offline, use provided name safely
          if (data.userName && typeof data.userName === 'string') {
            userName = data.userName.slice(0, 50);
          }
        }
      } else if (data.userName && typeof data.userName === 'string') {
        userName = data.userName.slice(0, 50);
        if (data.userAvatar && typeof data.userAvatar === 'string' && data.userAvatar.startsWith('http')) {
          userAvatar = data.userAvatar;
        }
      }

      const user: RoomUser = {
        socketId: socket.id,
        roomId,
        userId: authUserId,
        userName,
        userAvatar,
        status: 'focus',
        joinedAt: new Date(),
      };

      activeUsers.set(socket.id, user);

      // Collect only real active users currently in this room (NO mock peers)
      const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === roomId);

      // Broadcast real active presence and count
      io.to(roomId).emit('room_presence_update', {
        count: realRoomMembers.length,
        members: realRoomMembers,
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
    socket.on('send_message', async (data: { roomId?: string; text?: string; type?: 'message' | 'doubt_alert' }) => {
      if (!checkRateLimit(socket.id)) {
        socket.emit('socket_error', { message: 'Message rate limit exceeded. Please wait a moment.' });
        return;
      }

      const user = activeUsers.get(socket.id);
      const roomId = typeof data?.roomId === 'string' ? data.roomId.trim() : user?.roomId || '';
      const text = typeof data?.text === 'string' ? data.text.trim() : '';

      if (!roomId || !text || text.length > 2000) return;

      const message = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        senderName: user?.userName || 'Student',
        senderAvatar: user?.userAvatar || '',
        senderId: user?.userId,
        text,
        type: data.type === 'doubt_alert' ? 'doubt_alert' : 'message',
        createdAt: new Date().toISOString(),
      };

      // Broadcast immediately to everyone in the room
      io.to(roomId).emit('new_message', message);

      // Persist to MongoDB if valid ID
      try {
        if (roomId.match(/^[0-9a-fA-F]{24}$/)) {
          await StudyRoom.findByIdAndUpdate(roomId, {
            $push: { messages: message },
          });
        }
      } catch {
        // If DB is offline, WebSocket message broadcasting continues seamlessly
      }
    });

    // Raise Live Doubt inside Study Room
    socket.on('raise_doubt_alert', async (data: { roomId?: string; title?: string }) => {
      if (!checkRateLimit(socket.id, 3, 5000)) return;

      const user = activeUsers.get(socket.id);
      const roomId = typeof data?.roomId === 'string' ? data.roomId.trim() : user?.roomId || '';
      const title = typeof data?.title === 'string' ? data.title.trim().slice(0, 200) : '';

      if (!roomId || !title) return;

      const senderName = user?.userName || 'Student';

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
    socket.on('timer_action', (data: { roomId?: string; action?: string; timeRemaining?: number; isRunning?: boolean; mode?: string }) => {
      const user = activeUsers.get(socket.id);
      const roomId = typeof data?.roomId === 'string' ? data.roomId.trim() : user?.roomId || '';
      const validActions = ['start', 'pause', 'reset', 'skip'];

      if (!roomId || !data?.action || !validActions.includes(data.action)) return;

      socket.to(roomId).emit('timer_sync', {
        action: data.action,
        timeRemaining: typeof data.timeRemaining === 'number' && data.timeRemaining >= 0 ? data.timeRemaining : 25 * 60,
        isRunning: Boolean(data.isRunning),
        mode: data.mode || 'focus',
        triggeredBy: user?.userName || 'Peer',
      });
    });

    // Typing Indicators
    socket.on('typing', (data: { roomId?: string; isTyping?: boolean }) => {
      const user = activeUsers.get(socket.id);
      const roomId = typeof data?.roomId === 'string' ? data.roomId.trim() : user?.roomId || '';
      if (!roomId) return;
      socket.to(roomId).emit('user_typing_update', {
        userName: user?.userName || 'Student',
        isTyping: Boolean(data.isTyping),
      });
    });

    // Status Updates (e.g. break vs focus)
    socket.on('update_status', (data: { roomId?: string; status?: 'focus' | 'break' | 'active' }) => {
      const user = activeUsers.get(socket.id);
      const validStatuses = ['focus', 'break', 'active'];
      if (user && data?.status && validStatuses.includes(data.status)) {
        user.status = data.status;
        const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === user.roomId);
        io.to(user.roomId).emit('room_presence_update', {
          count: realRoomMembers.length,
          members: realRoomMembers,
        });
      }
    });

    // Disconnect / Leave
    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        const { roomId, userName } = user;
        activeUsers.delete(socket.id);
        messageTimestamps.delete(socket.id);

        const realRoomMembers = Array.from(activeUsers.values()).filter((u) => u.roomId === roomId);

        io.to(roomId).emit('room_presence_update', {
          count: realRoomMembers.length,
          members: realRoomMembers,
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
