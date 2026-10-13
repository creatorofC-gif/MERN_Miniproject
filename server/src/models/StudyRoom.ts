import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomMember {
  user?: mongoose.Types.ObjectId;
  name: string;
  avatar: string;
  joinedAt: Date;
  status: 'active' | 'break' | 'focus';
}

export interface IRoomDoubtReply {
  _id?: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface IRoomMessage {
  _id?: string;
  senderName: string;
  senderAvatar: string;
  senderId?: string;
  text: string;
  type?: 'message' | 'doubt_alert' | 'system';
  doubtReplies?: IRoomDoubtReply[];
  isResolved?: boolean;
  createdAt: Date;
}

export interface IStudyRoom extends Document {
  name: string;
  subject: 'Mathematics' | 'Computer Science' | 'Biology' | 'Physics' | 'Chemistry' | 'Other';
  description: string;
  status: 'live' | 'focus' | 'break';
  vibe: 'Lofi Beats' | 'Deep Silence' | 'Active Discussion' | 'Pomodoro';
  category: string;
  owner?: mongoose.Types.ObjectId;
  participants: IRoomMember[];
  participantCount: number;
  maxMembers: number;
  pomodoroState: {
    durationMinutes: number;
    remainingSeconds: number;
    isRunning: boolean;
    mode: 'focus' | 'short_break' | 'long_break';
  };
  messages: IRoomMessage[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyRoomSchema = new Schema<IStudyRoom>(
  {
    name: { type: String, required: true, trim: true },
    subject: { 
      type: String, 
      required: true, 
      enum: ['Mathematics', 'Computer Science', 'Biology', 'Physics', 'Chemistry', 'Other'],
      default: 'Other'
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['live', 'focus', 'break'], default: 'live' },
    vibe: { 
      type: String, 
      enum: ['Lofi Beats', 'Deep Silence', 'Active Discussion', 'Pomodoro'],
      default: 'Lofi Beats' 
    },
    category: { type: String, default: 'STEM HUB' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        joinedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['active', 'break', 'focus'], default: 'active' },
      }
    ],
    participantCount: { type: Number, default: 1 },
    maxMembers: { type: Number, default: 50 },
    pomodoroState: {
      durationMinutes: { type: Number, default: 25 },
      remainingSeconds: { type: Number, default: 1500 },
      isRunning: { type: Boolean, default: true },
      mode: { type: String, enum: ['focus', 'short_break', 'long_break'], default: 'focus' },
    },
    messages: [
      {
        senderName: { type: String, required: true },
        senderAvatar: { type: String, default: '' },
        senderId: { type: String },
        text: { type: String, required: true },
        type: { type: String, enum: ['message', 'doubt_alert', 'system'], default: 'message' },
        doubtReplies: [
          {
            senderName: { type: String, required: true },
            senderAvatar: { type: String, default: '' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          }
        ],
        isResolved: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StudyRoom = mongoose.model<IStudyRoom>('StudyRoom', StudyRoomSchema);
