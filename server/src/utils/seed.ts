import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { Doubt } from '../models/Doubt.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studysphere';

export const seedDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    console.log('[Seed] Connected to MongoDB. Checking collections...');

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already has ${userCount} users. Skipping destructive re-seed.`);
      return;
    }

    console.log('[Seed] Database is empty. Seeding initial data matching Figma references...');

    await User.deleteMany({});
    await StudyRoom.deleteMany({});
    await Doubt.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const alex = await User.create({
      name: 'Alex Mercer',
      email: 'alex@studysphere.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tier: 'Master Tier',
      points: 1250,
      streak: 14,
      year: '3rd Year',
      branch: 'Computer Science & Math',
      college: 'Stanford University',
      bio: 'Deep work enthusiast. Studying advanced algorithms, differential equations and system architecture.',
      role: 'student',
      dailyGoals: [
        { title: 'Study 2 hours', completed: true },
        { title: 'Solve 1 Doubt', completed: false },
        { title: 'Attend 1 Study Room', completed: false },
      ],
    });

    const elena = await User.create({
      name: 'Elena R.',
      email: 'elena@studysphere.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      tier: 'Master',
      points: 12400,
      streak: 42,
      year: '4th Year',
      branch: 'Mathematics',
      college: 'MIT',
      role: 'mentor',
    });

    const marcus = await User.create({
      name: 'Marcus T.',
      email: 'marcus@studysphere.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tier: 'Scholar',
      points: 9800,
      streak: 28,
      year: '3rd Year',
      branch: 'Physics',
      college: 'UC Berkeley',
      role: 'student',
    });

    const james = await User.create({
      name: 'James L.',
      email: 'james@studysphere.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      tier: 'Scholar',
      points: 8100,
      streak: 19,
      year: '2nd Year',
      branch: 'Computer Science',
      college: 'Carnegie Mellon',
      role: 'student',
    });

    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@studysphere.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      tier: 'Scholar',
      points: 1120,
      streak: 9,
      year: '2nd Year',
      branch: 'Applied Physics',
      college: 'Harvard',
      role: 'student',
    });

    console.log('[Seed] Users seeded successfully.');

    // 2. Create Study Rooms
    await StudyRoom.create({
      name: 'Calculus II Deep Work',
      subject: 'Mathematics',
      description: 'Focused session tackling multivariate calculus and differential equations.',
      status: 'live',
      vibe: 'Lofi Beats',
      category: 'STEM HUB',
      owner: alex._id,
      participantCount: 24,
      maxMembers: 50,
      pomodoroState: {
        durationMinutes: 25,
        remainingSeconds: 1500,
        isRunning: true,
        mode: 'focus',
      },
      participants: [
        {
          name: 'Sarah J.',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          status: 'focus',
          joinedAt: new Date(),
        },
        {
          name: 'Mike T.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          status: 'break',
          joinedAt: new Date(),
        },
        {
          name: 'Alex R.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          status: 'focus',
          joinedAt: new Date(),
        },
        {
          name: 'Elena G.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          status: 'focus',
          joinedAt: new Date(),
        },
      ],
      messages: [
        {
          senderName: 'Mike T.',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          text: 'Can someone explain integration by parts again?',
          type: 'message',
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          senderName: 'Live Doubt Raised',
          senderAvatar: '',
          text: 'Integration by Parts specific example stuck.',
          type: 'doubt_alert',
          createdAt: new Date(Date.now() - 14 * 60 * 1000),
        },
      ],
    });

    await StudyRoom.create([
      {
        name: 'Organic Chemistry II',
        subject: 'Chemistry',
        description: 'Reviewing substitution reactions and stereochemistry for the upcoming midterm.',
        status: 'live',
        vibe: 'Lofi Beats',
        category: 'STEM HUB',
        owner: sarah._id,
        participantCount: 15,
        participants: [
          { name: 'Sarah C.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'David K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'focus' },
        ],
      },
      {
        name: 'Data Structures Group',
        subject: 'Computer Science',
        description: 'Silent study session for CS201. Graph algorithms and dynamic programming practice.',
        status: 'focus',
        vibe: 'Deep Silence',
        category: 'ENGINEERING',
        owner: alex._id,
        participantCount: 10,
        participants: [
          { name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'James L.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'focus' },
        ],
      },
      {
        name: 'Calculus III Study Prep',
        subject: 'Mathematics',
        description: 'Working through problem set 4 together. Voice chat open.',
        status: 'live',
        vibe: 'Active Discussion',
        category: 'STEM HUB',
        owner: marcus._id,
        participantCount: 6,
        participants: [
          { name: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'focus' },
        ],
      },
      {
        name: 'Modern Physics',
        subject: 'Physics',
        description: 'Get your brain on the physics. Wave-particle duality & relativity review.',
        status: 'live',
        vibe: 'Active Discussion',
        category: 'STEM HUB',
        owner: marcus._id,
        participantCount: 6,
        participants: [
          { name: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'focus' },
          { name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'focus' },
        ],
      },
      {
        name: 'Advanced Calculus',
        subject: 'Mathematics',
        description: 'Deep focus on Taylor series approximations and vector spaces.',
        status: 'live',
        vibe: 'Lofi Beats',
        category: 'STEM HUB',
        owner: alex._id,
        participantCount: 5,
        participants: [
          { name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'focus' },
        ],
      },
    ]);

    console.log('[Seed] Study rooms seeded successfully.');

    // 3. Create Doubts
    await Doubt.create([
      {
        title: 'Need help with partial differential equations (Heat Equation)',
        description: "I'm stuck on setting up the boundary conditions for a 1D rod insulated at both ends. Specifically, how do the Neumann boundary conditions translate into the eigenvalues for the Fourier series expansion?",
        authorName: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        authorTier: 'Scholar',
        authorId: sarah._id,
        subject: 'Mathematics',
        tags: ['Mathematics', 'University Level'],
        pointsReward: 150,
        isUrgent: true,
        aiHelpTimerSeconds: 270,
        status: 'open',
        upvotes: 8,
      },
      {
        title: 'Why does the recursive call fail here? (Python)',
        description: 'Getting RecursionError on base case evaluation in factorial function.',
        codeSnippet: `def factorial(n):
    if n == 0: return 1
    return n * factorial(n)
# getting RecursionError`,
        authorName: 'David Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorTier: 'Novice',
        authorId: james._id,
        subject: 'Computer Science',
        tags: ['Computer Science', 'Python'],
        pointsReward: 50,
        isUrgent: false,
        aiHelpTimerSeconds: 420,
        status: 'open',
        upvotes: 4,
      },
      {
        title: 'Help with Organic Chemistry reaction mechanism',
        description: 'Electrophilic aromatic substitution mechanism clarification needed for bromination with FeBr3.',
        authorName: 'Elena R.',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authorTier: 'Master',
        authorId: elena._id,
        subject: 'Chemistry',
        tags: ['Chemistry', 'Organic'],
        pointsReward: 50,
        isUrgent: true,
        status: 'open',
        upvotes: 12,
      },
      {
        title: 'Physics: Thermodynamics equilibrium derivation',
        description: 'Deriving the Maxwell-Boltzmann distribution and Helmholtz free energy minimum.',
        authorName: 'Marcus T.',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorTier: 'Scholar',
        authorId: marcus._id,
        subject: 'Physics',
        tags: ['Physics', 'Thermodynamics'],
        pointsReward: 120,
        isUrgent: false,
        status: 'open',
        upvotes: 15,
      },
    ]);

    console.log('[Seed] Database seed completed successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
  }
};

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase().then(() => {
    console.log('[Seed] Database seed finished.');
    process.exit(0);
  });
}
