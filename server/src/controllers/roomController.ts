import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StudyRoom } from '../models/StudyRoom.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, vibe, search } = req.query;
    const filter: any = {};

    if (subject && subject !== 'All Subjects') {
      filter.subject = subject;
    }

    if (vibe) {
      filter.vibe = vibe;
    }

    if (search) {
      const sanitized = escapeRegex(String(search));
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const rooms = await StudyRoom.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching rooms' });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : (rawId || '');
    let room = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      room = await StudyRoom.findById(id);
    } else {
      const escapedId = escapeRegex(id.replace(/-/g, ' '));
      room = await StudyRoom.findOne({
        name: { $regex: escapedId, $options: 'i' },
      });
    }

    if (!room) {
      res.status(404).json({ message: 'Study room not found' });
      return;
    }

    res.json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching room' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, subject, description, vibe, category } = req.body;
    if (
      !name ||
      typeof name !== 'string' ||
      !subject ||
      typeof subject !== 'string' ||
      !description ||
      typeof description !== 'string'
    ) {
      res.status(400).json({ message: 'Name, subject, and description are required string fields' });
      return;
    }

    let creatorName = 'Student';
    let creatorAvatar = '';
    let creatorId = undefined;

    if (req.user?.id) {
      creatorId = req.user.id;
      const user = await User.findById(req.user.id);
      if (user) {
        creatorName = user.name;
        creatorAvatar = user.avatar || '';
      }
    }

    const newRoom = await StudyRoom.create({
      name,
      subject,
      description,
      vibe: vibe || 'Lofi Beats',
      category: category || 'STEM HUB',
      owner: creatorId,
      participantCount: 1,
      participants: [
        {
          user: creatorId as any,
          name: creatorName,
          avatar: creatorAvatar,
          status: 'focus',
          joinedAt: new Date(),
        },
      ],
      messages: [
        {
          senderName: 'System',
          senderAvatar: '',
          text: `Welcome to ${name}! Stay focused and productive.`,
          type: 'system',
          createdAt: new Date(),
        },
      ],
    });

    res.status(201).json(newRoom);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating room' });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : (rawId || '');
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid study room ID format' });
      return;
    }

    const { name, avatar } = req.body;

    const room = await StudyRoom.findById(id);
    if (!room) {
      res.status(404).json({ message: 'Study room not found' });
      return;
    }

    let memberName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 50) : 'Student';
    let memberAvatar = '';
    if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image/'))) {
      memberAvatar = avatar;
    }
    const userId = req.user?.id;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        memberName = user.name;
        memberAvatar = user.avatar || memberAvatar;
      }
    }

    const existingMember = room.participants.find(
      (p) => (userId && p.user?.toString() === userId) || p.name === memberName
    );
    if (!existingMember) {
      room.participants.push({
        user: userId as any,
        name: memberName,
        avatar: memberAvatar,
        status: 'focus',
        joinedAt: new Date(),
      } as any);
      room.participantCount = room.participants.length;
      await room.save();
    }

    res.json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error joining room' });
  }
};
