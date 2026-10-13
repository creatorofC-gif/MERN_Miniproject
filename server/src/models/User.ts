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
      default: '' 
    },
    tier: { type: String, default: 'Novice Scholar' },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    year: { type: String, default: '' },
    branch: { type: String, default: '' },
    college: { type: String, default: '' },
    bio: { type: String, default: '' },
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
