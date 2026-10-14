import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { Doubt } from '../models/Doubt.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studysphere';

export const seedDatabase = async (standalone = true): Promise<void> => {
  try {
    if (standalone) {
      let cleanUri = MONGO_URI.trim().replace(/^["']|["']$/g, '');
      cleanUri = cleanUri.replace(/w=majority=Cluster0/gi, 'w=majority&appName=Cluster0');
      cleanUri = cleanUri.replace(/majority=Cluster0/gi, 'majority&appName=Cluster0');
      cleanUri = cleanUri.replace(/w=majority=[^&]*/gi, 'w=majority');
      if (cleanUri.match(/\/?\?studysphere(\b|$)/i)) {
        cleanUri = cleanUri.replace(/\/?\?studysphere(\b|$)/i, '/StudySphere?retryWrites=true&w=majority');
      }

      console.log('[Seed] Connecting to MongoDB:', cleanUri);
      await mongoose.connect(cleanUri, { dbName: 'StudySphere', w: 'majority' });
      console.log('[Seed] Connected to database:', mongoose.connection.name);
    }

    // Standard demo password for presentation accounts
    const DEMO_PASSWORD = 'Password123!';
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // 1. Clean existing test/mock data to prevent bloat
    console.log('[Seed] Cleaning old demo records...');
    await Doubt.deleteMany({});
    await StudyRoom.deleteMany({});

    // Keep pristine user if exists, or create it fresh
    const demoUsers = [
      {
        name: 'Alex Mercer',
        email: 'alex@studysphere.edu',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: 'pro' as const,
        tier: 'Master Scholar',
        points: 1250,
        streak: 14,
        college: 'Stanford University',
        branch: 'Computer Science',
        bio: 'Algorithms & Distributed Systems researcher. Active peer tutor.',
        role: 'student' as const,
        dailyGoals: [
          { title: 'Solve 2 DSA graph doubts', completed: true },
          { title: 'Complete 50-minute Pomodoro block', completed: true },
          { title: 'Review System Design notes', completed: false },
        ],
      },
      {
        name: 'Elena Rostova',
        email: 'elena@university.edu',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        plan: 'university' as const,
        tier: 'Grand Scholar',
        points: 2100,
        streak: 21,
        college: 'MIT (Massachusetts Institute of Technology)',
        branch: 'AI & Data Science',
        bio: 'Peer Mentor & Campus Circle Lead. Love solving complex graph and calculus problems.',
        role: 'mentor' as const,
        dailyGoals: [
          { title: 'Lead Calculus III circle', completed: true },
          { title: 'Answer 3 peer doubts', completed: true },
          { title: 'Maintain 21-day study streak', completed: true },
        ],
      },
      {
        name: 'Jordan Lee',
        email: 'jordan@college.edu',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        plan: 'free' as const,
        tier: 'Novice Scholar',
        points: 150,
        streak: 3,
        college: 'UC Berkeley',
        branch: 'Electrical Engineering',
        bio: 'Freshman enthusiastic about digital electronics, physics, and calculus.',
        role: 'student' as const,
        dailyGoals: [
          { title: 'Join Quantum Mechanics study room', completed: true },
          { title: 'Review Kirchhoff laws lecture', completed: false },
        ],
      },
      {
        name: 'Pristine User',
        email: 'pristine@university.edu',
        passwordHash,
        avatar: '',
        plan: 'pro' as const,
        tier: 'Novice Scholar',
        points: 50,
        streak: 1,
        college: 'University Institute of Technology',
        branch: 'Computer Science & Engineering',
        bio: 'Full-stack developer and collaborative learner exploring StudySphere.',
        role: 'student' as const,
        dailyGoals: [
          { title: 'Explore study rooms', completed: true },
          { title: 'Post first academic doubt', completed: false },
        ],
      },
    ];

    // Upsert demo accounts
    const createdUsers: any[] = [];
    for (const u of demoUsers) {
      const userDoc = await User.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdUsers.push(userDoc);
      console.log(`[Seed] User configured: ${userDoc.name} (${userDoc.email}) [Plan: ${userDoc.plan}]`);
    }

    const alex = createdUsers.find(u => u.email === 'alex@studysphere.edu') || createdUsers[0];
    const elena = createdUsers.find(u => u.email === 'elena@university.edu') || createdUsers[1];
    const jordan = createdUsers.find(u => u.email === 'jordan@college.edu') || createdUsers[2];
    const pristine = createdUsers.find(u => u.email === 'pristine@university.edu') || createdUsers[3];

    // 2. Seed 4 Curated Study Rooms
    console.log('[Seed] Seeding curated study rooms...');
    const roomsData = [
      {
        name: 'Calculus & Linear Algebra Focus',
        subject: 'Mathematics',
        description: 'Quiet study circle for Multivariable Calculus problem sets and Linear Algebra proofs.',
        status: 'focus',
        vibe: 'Deep Silence',
        category: 'Mathematics',
        owner: elena._id,
        participantCount: 4,
        maxMembers: 12,
        pomodoroState: {
          durationMinutes: 25,
          remainingSeconds: 1240,
          isRunning: true,
          mode: 'focus',
        },
        participants: [
          { name: elena.name, avatar: elena.avatar, joinedAt: new Date(), status: 'focus', user: elena._id },
          { name: alex.name, avatar: alex.avatar, joinedAt: new Date(), status: 'focus', user: alex._id },
          { name: jordan.name, avatar: jordan.avatar, joinedAt: new Date(), status: 'focus', user: jordan._id },
          { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', joinedAt: new Date(), status: 'focus' },
        ],
        messages: [
          {
            senderName: elena.name,
            senderAvatar: elena.avatar,
            senderId: elena._id.toString(),
            text: 'Welcome everyone! 25-minute Pomodoro deep work block is active. Please keep text to essential queries.',
            type: 'message',
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
          },
          {
            senderName: alex.name,
            senderAvatar: alex.avatar,
            senderId: alex._id.toString(),
            text: 'Working on Stokes theorem problem set 4. Let me know if anyone wants to verify contour results later.',
            type: 'message',
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
          },
        ],
        isPrivate: false,
      },
      {
        name: 'Algorithms & System Design Circle',
        subject: 'Computer Science',
        description: 'Collaborative DSA problem solving, LeetCode discussions, and system architecture reviews.',
        status: 'live',
        vibe: 'Active Discussion',
        category: 'Computer Science',
        owner: alex._id,
        participantCount: 5,
        maxMembers: 16,
        pomodoroState: {
          durationMinutes: 50,
          remainingSeconds: 2450,
          isRunning: true,
          mode: 'focus',
        },
        participants: [
          { name: alex.name, avatar: alex.avatar, joinedAt: new Date(), status: 'active', user: alex._id },
          { name: pristine.name, avatar: pristine.avatar, joinedAt: new Date(), status: 'active', user: pristine._id },
          { name: 'Marcus Taylor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', joinedAt: new Date(), status: 'active' },
          { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', joinedAt: new Date(), status: 'break' },
          { name: 'Elena Rostova', avatar: elena.avatar, joinedAt: new Date(), status: 'active', user: elena._id },
        ],
        messages: [
          {
            senderName: alex.name,
            senderAvatar: alex.avatar,
            senderId: alex._id.toString(),
            text: 'Discussing Tarjan algorithm for strongly connected components today. Feel free to raise questions in the doubt tab!',
            type: 'message',
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
          },
        ],
        isPrivate: false,
      },
      {
        name: 'Organic Chemistry II Review',
        subject: 'Chemistry',
        description: 'Reaction mechanisms, synthesis pathways, and spectroscopy practice.',
        status: 'live',
        vibe: 'Pomodoro',
        category: 'Chemistry',
        owner: jordan._id,
        participantCount: 3,
        maxMembers: 8,
        pomodoroState: {
          durationMinutes: 25,
          remainingSeconds: 850,
          isRunning: true,
          mode: 'focus',
        },
        participants: [
          { name: jordan.name, avatar: jordan.avatar, joinedAt: new Date(), status: 'focus', user: jordan._id },
          { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', joinedAt: new Date(), status: 'focus' },
          { name: alex.name, avatar: alex.avatar, joinedAt: new Date(), status: 'active', user: alex._id },
        ],
        messages: [
          {
            senderName: jordan.name,
            senderAvatar: jordan.avatar,
            senderId: jordan._id.toString(),
            text: 'Synthesizing aromatic aldehydes via Gattermann-Koch reaction. Step-by-step notes shared in notes tab.',
            type: 'message',
            createdAt: new Date(Date.now() - 1000 * 60 * 5),
          },
        ],
        isPrivate: false,
      },
      {
        name: 'Quantum Mechanics & Modern Physics',
        subject: 'Physics',
        description: 'Schrodinger wave equations, particle in a box, and quantum tunneling review.',
        status: 'live',
        vibe: 'Deep Silence',
        category: 'Physics',
        owner: elena._id,
        participantCount: 2,
        maxMembers: 10,
        pomodoroState: {
          durationMinutes: 45,
          remainingSeconds: 1900,
          isRunning: true,
          mode: 'focus',
        },
        participants: [
          { name: elena.name, avatar: elena.avatar, joinedAt: new Date(), status: 'focus', user: elena._id },
          { name: jordan.name, avatar: jordan.avatar, joinedAt: new Date(), status: 'focus', user: jordan._id },
        ],
        messages: [],
        isPrivate: false,
      },
    ];

    for (const r of roomsData) {
      await StudyRoom.create(r);
      console.log(`[Seed] Study Room created: "${r.name}" (${r.subject})`);
    }

    // 3. Seed 3 Curated Doubts
    console.log('[Seed] Seeding curated peer doubts...');
    const doubtsData = [
      {
        title: 'How to optimize Dijkstra algorithm for sparse graphs with Fibonacci Heap?',
        description: 'I am implementing Dijkstra algorithm for a graph with 10^5 vertices and 2*10^5 edges. Standard binary heap gives O(E log V). How does Fibonacci Heap reduce amortized decrease-key complexity to O(1), and why is binary heap still often preferred in practical benchmarks?',
        codeSnippet: `// Min-priority queue decrease key implementation\nvoid decreaseKey(int v, int newDist) {\n  dist[v] = newDist;\n  pq.push({newDist, v}); // Lazy deletion vs decrease-key\n}`,
        authorName: alex.name,
        authorAvatar: alex.avatar,
        authorTier: alex.tier,
        authorId: alex._id,
        subject: 'Computer Science',
        tags: ['Algorithms', 'GraphTheory', 'Complexity', 'DataStructures'],
        pointsReward: 75,
        isUrgent: true,
        status: 'open',
        isResolved: false,
        upvotes: 6,
        answers: [],
      },
      {
        title: 'Evaluating contour integral using Cauchy Residue Theorem',
        description: 'Evaluate the closed contour integral of f(z) = 1 / (z^2 + 1)^2 along the contour |z| = 2 oriented counterclockwise.',
        codeSnippet: `\\oint_{|z|=2} \\frac{1}{(z^2 + 1)^2} dz`,
        authorName: jordan.name,
        authorAvatar: jordan.avatar,
        authorTier: jordan.tier,
        authorId: jordan._id,
        subject: 'Mathematics',
        tags: ['Calculus', 'ComplexAnalysis', 'ResidueTheorem'],
        pointsReward: 50,
        isUrgent: false,
        status: 'solved',
        isResolved: true,
        upvotes: 12,
        answers: [
          {
            authorName: elena.name,
            authorAvatar: elena.avatar,
            authorTier: elena.tier,
            authorId: elena._id,
            content: 'The singularities are poles of order 2 at z = i and z = -i. Both lie strictly inside |z| = 2. Calculating the residue at z = i:\nRes(f, i) = d/dz [ 1/(z + i)^2 ] evaluated at z=i gives -2 / (2i)^3 = -1/(4i).\nBy symmetry, Res(f, -i) = 1/(4i).\nThe sum of residues is -1/(4i) + 1/(4i) = 0.\nTherefore, by Cauchy Residue Theorem, the integral evaluates to 2 * pi * i * (0) = 0.',
            isAccepted: true,
            upvotes: 8,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
        ],
      },
      {
        title: 'Regioselectivity of Hydroboration-Oxidation vs Oxymercuration',
        description: 'Why does hydroboration-oxidation of an asymmetric alkene result in Anti-Markovnikov addition with syn-stereochemistry, while oxymercuration-demercuration yields Markovnikov addition without carbocation rearrangement?',
        codeSnippet: `R-CH=CH2  +  BH3:THF  -->  [Organoborane]  --> R-CH2-CH2-OH`,
        authorName: pristine.name,
        authorAvatar: pristine.avatar,
        authorTier: pristine.tier,
        authorId: pristine._id,
        subject: 'Chemistry',
        tags: ['OrganicChemistry', 'Alkenes', 'Mechanisms'],
        pointsReward: 50,
        isUrgent: false,
        status: 'open',
        isResolved: false,
        upvotes: 4,
        answers: [],
      },
    ];

    for (const d of doubtsData) {
      await Doubt.create(d);
      console.log(`[Seed] Doubt created: "${d.title}" [Status: ${d.status}]`);
    }

    console.log('\n======================================================');
    console.log('✅ StudySphere Mock Dataset Successfully Seeded!');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS READY FOR LOGIN & PRESENTATION:');
    console.log('------------------------------------------------------');
    demoUsers.forEach((u) => {
      console.log(`• Name: ${u.name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Password: ${DEMO_PASSWORD}`);
      console.log(`  Plan: ${u.plan.toUpperCase()} | Tier: ${u.tier} | Points: ${u.points}`);
      console.log('------------------------------------------------------');
    });

    if (standalone) {
      await mongoose.disconnect();
      console.log('[Seed] Database connection closed.');
    }
  } catch (err: any) {
    console.error('[Seed] Error seeding database:', err.message);
    if (standalone) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase(true);
}
