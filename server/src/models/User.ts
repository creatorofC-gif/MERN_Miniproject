import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  tier: string;
  points: number;
  streak: number;
  year?: string;
  branch?: string;
  college?: string;
  bio?: string;
  role: 'student' | 'mentor' | 'admin';
  dailyGoals: {
    title: string;
    completed: boolean;
  }[];
  joinedRooms: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' 
    },
    tier: { type: String, default: 'Master Tier' },
    points: { type: Number, default: 1250 },
    streak: { type: Number, default: 14 },
    year: { type: String, default: '3rd Year' },
    branch: { type: String, default: 'Computer Science' },
    college: { type: String, default: 'Stanford University' },
    bio: { type: String, default: 'Focused on algorithms, distributed systems, and calculus.' },
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    dailyGoals: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    joinedRooms: [{ type: Schema.Types.ObjectId, ref: 'StudyRoom' }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
