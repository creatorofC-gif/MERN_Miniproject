import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { Doubt } from '../models/Doubt.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studysphere';

export const inspectAndClean = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[CleanDB] Connected to MongoDB database:', mongoose.connection.name);

    // List all users
    const allUsers = await User.find({}).select('name email points streak createdAt');
    console.log(`[CleanDB] Total users in DB: ${allUsers.length}`);
    for (const u of allUsers) {
      console.log(`  - User: ${u.name} <${u.email}> (${u.points} pts, ${u.streak}d streak)`);
    }

    // List all doubts
    const allDoubts = await Doubt.find({}).select('title authorName isResolved createdAt');
    console.log(`[CleanDB] Total doubts in DB: ${allDoubts.length}`);
    for (const d of allDoubts) {
      console.log(`  - Doubt: "${d.title}" by ${d.authorName}`);
    }

    // List all rooms
    const allRooms = await StudyRoom.find({}).select('name subject participantCount createdAt');
    console.log(`[CleanDB] Total rooms in DB: ${allRooms.length}`);
    for (const r of allRooms) {
      console.log(`  - Room: "${r.name}" (${r.subject})`);
    }

    // Identify mock / seeded users
    const mockEmails = [
      'alex@studysphere.io',
      'elena@studysphere.io',
      'marcus@studysphere.io',
      'james@studysphere.io',
      'sarah@studysphere.io',
      'david@studysphere.io',
      'priya@studysphere.io',
      'maya@studysphere.io',
    ];

    // Delete mock users
    const userDelResult = await User.deleteMany({
      $or: [
        { email: { $in: mockEmails } },
        { email: { $regex: /@studysphere\.io$/i } },
      ],
    });
    console.log(`[CleanDB] Removed ${userDelResult.deletedCount} mock users.`);

    // Delete all mock doubts
    const doubtDelResult = await Doubt.deleteMany({
      $or: [
        { authorName: { $in: ['Alex Mercer', 'Elena R.', 'Marcus T.', 'James L.', 'Sarah C.', 'Sarah Chen', 'David Kim', 'Priya S.', 'Elena Rostova', 'Marcus Chen'] } },
        { title: { $regex: /Calculus III|Quantum Physics|Organic Chemistry|Operating Systems|Heat Equation|recursive call|Thermodynamics/i } },
      ],
    });
    console.log(`[CleanDB] Removed ${doubtDelResult.deletedCount} mock doubts.`);

    // Delete all mock rooms created by seed script
    const roomDelResult = await StudyRoom.deleteMany({
      $or: [
        { name: { $regex: /Calculus II Deep Work|Algorithms & Dynamic Programming|Organic Chemistry II|Discrete Mathematics|Calculus III Study Prep|Data Structures Group|Modern Physics|Advanced Calculus/i } },
        { 'participants.name': { $in: ['Alex Mercer', 'Elena R.', 'Marcus T.', 'James L.', 'Sarah Chen', 'David Kim'] } },
      ],
    });
    console.log(`[CleanDB] Removed ${roomDelResult.deletedCount} mock study rooms.`);

    // Delete test users created during automated runs
    const testUserDelResult = await User.deleteMany({
      $or: [
        { email: { $in: ['tester_alpha_99@studysphere.edu', 'jordan_fresh_2026@studysphere.edu', 'janedoe@email.com', 'alexis@email.com', 'cleanscholar179@test.edu'] } },
        { email: { $regex: /@studysphere\.io$|@studysphere\.edu$|test\.edu$/i } },
      ],
    });
    console.log(`[CleanDB] Removed ${testUserDelResult.deletedCount} test dummy users.`);

    const remainingUsers = await User.find({}).select('name email');
    const remainingDoubts = await Doubt.find({}).select('title authorName');
    const remainingRooms = await StudyRoom.find({}).select('name');

    console.log(`[CleanDB] Summary of clean database:`);
    console.log(`  Users remaining: ${remainingUsers.length} (${remainingUsers.map(u => u.name).join(', ')})`);
    console.log(`  Doubts remaining: ${remainingDoubts.length}`);
    console.log(`  Rooms remaining: ${remainingRooms.length}`);

    await mongoose.disconnect();
    console.log('[CleanDB] Database cleaned successfully.');
  } catch (err: any) {
    console.error('[CleanDB] Error cleaning DB:', err.message);
  }
};

inspectAndClean();
