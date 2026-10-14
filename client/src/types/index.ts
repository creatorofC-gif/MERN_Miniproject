export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  points: number;
  streak: number;
  year?: string;
  branch?: string;
  college?: string;
  bio?: string;
  role: 'student' | 'mentor' | 'admin';
  dailyGoals?: {
    title: string;
    completed: boolean;
  }[];
}

export interface Participant {
  id?: string;
  user?: string;
  name: string;
  avatar: string;
  status: 'focus' | 'break' | 'active';
  isMuted?: boolean;
  studyHours?: number;
  joinedAt?: string;
}

export interface DoubtReply {
  _id: string;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
}

export interface PrivateDoubtMessage {
  _id?: string;
  doubtId: string;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
}

export interface ChatMessage {
  _id?: string;
  senderName: string;
  senderAvatar: string;
  senderId?: string;
  text: string;
  type?: 'message' | 'doubt_alert' | 'system' | 'doubt_answer';
  createdAt: string;
  doubtId?: string;
  doubtReplies?: DoubtReply[];
  isResolved?: boolean;
}

export interface StudyRoom {
  _id: string;
  id?: string;
  name: string;
  subject: 'Mathematics' | 'Computer Science' | 'Biology' | 'Physics' | 'Chemistry' | 'Other';
  description: string;
  status: 'live' | 'focus' | 'break';
  vibe: 'Lofi Beats' | 'Deep Silence' | 'Active Discussion' | 'Pomodoro';
  category: string;
  owner?: string;
  participants: Participant[];
  participantCount: number;
  maxMembers: number;
  pomodoroState?: {
    durationMinutes: number;
    remainingSeconds: number;
    isRunning: boolean;
    mode: 'focus' | 'short_break' | 'long_break';
  };
  messages?: ChatMessage[];
  createdAt: string;
}

export interface Answer {
  _id?: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  authorId?: string;
  content: string;
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
}

export interface Doubt {
  _id: string;
  id?: string;
  title: string;
  description: string;
  codeSnippet?: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  authorId?: string;
  subject: string;
  tags: string[];
  pointsReward: number;
  bountyPoints?: number;
  isUrgent: boolean;
  isResolved?: boolean;
  aiHelpTimerSeconds?: number;
  status: 'open' | 'claimed' | 'solved';
  claimedBy?: {
    userId: string;
    name: string;
  };
  answers: Answer[];
  upvotes: number;
  createdAt: string;
}

export interface TopSolver {
  _id?: string;
  name: string;
  avatar: string;
  tier: string;
  points: number;
  streak: number;
  college?: string;
  branch?: string;
}
