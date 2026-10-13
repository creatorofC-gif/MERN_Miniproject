import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  _id?: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  authorId?: mongoose.Types.ObjectId;
  content: string;
  isAccepted: boolean;
  upvotes: number;
  createdAt: Date;
}

export interface IDoubt extends Document {
  title: string;
  description: string;
  codeSnippet?: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  authorId?: mongoose.Types.ObjectId;
  subject: string;
  tags: string[];
  pointsReward: number;
  isUrgent: boolean;
  aiHelpTimerSeconds: number;
  status: 'open' | 'claimed' | 'solved';
  isResolved?: boolean;
  claimedBy?: {
    userId: mongoose.Types.ObjectId;
    name: string;
  };
  answers: IAnswer[];
  upvotes: number;
  upvotedBy?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DoubtSchema = new Schema<IDoubt>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    codeSnippet: { type: String },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    authorTier: { type: String, default: 'Scholar' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true },
    tags: [{ type: String }],
    pointsReward: { type: Number, default: 50 },
    isUrgent: { type: Boolean, default: false },
    aiHelpTimerSeconds: { type: Number, default: 300 },
    status: { type: String, enum: ['open', 'claimed', 'solved'], default: 'open' },
    isResolved: { type: Boolean, default: false },
    claimedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
    },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    answers: [
      {
        authorName: { type: String, required: true },
        authorAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        authorTier: { type: String, default: 'Master' },
        authorId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        isAccepted: { type: Boolean, default: false },
        upvotes: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model<IDoubt>('Doubt', DoubtSchema);
