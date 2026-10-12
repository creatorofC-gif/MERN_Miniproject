import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StudyRoom } from '../models/StudyRoom.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const MOCK_STUDY_PEERS = [
  {
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'focus',
    joinedAt: new Date(),
  },
  {
    name: 'Mike Torres',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'break',
    joinedAt: new Date(),
  },
  {
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'focus',
    joinedAt: new Date(),
  },
  {
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    joinedAt: new Date(),
  },
];

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
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
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
      room = await StudyRoom.findOne({
        $or: [
          { _id: id },
          { name: { $regex: id.replace(/-/g, ' '), $options: 'i' } },
        ],
      });
    }

    if (!room) {
      // Dynamic fallback for any fresh or custom room slug
      const formattedTitle = id.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const fallbackRoom = {
        _id: id,
        id,
        name: formattedTitle || 'Study Session',
        subject: 'Mathematics',
        description: 'Collaborative deep work session with synchronized focus timer and peer study buddies.',
        status: 'live',
        vibe: 'Lofi Beats',
        category: 'FOCUS HUB',
        participantCount: 5,
        participants: [
          ...MOCK_STUDY_PEERS,
          {
            name: 'Alex Mercer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            status: 'focus',
            joinedAt: new Date(),
          },
        ],
        messages: [
          {
            _id: 'sys-welcome',
            senderName: 'System',
            senderAvatar: '',
            text: `Welcome to ${formattedTitle}! Pomodoro timer is synchronized.`,
            type: 'system',
            createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          },
          {
            _id: 'msg-peer-1',
            senderName: 'Sarah Jenkins',
            senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
            text: 'Hey everyone! Starting my 50min deep work sprint here 📚',
            type: 'message',
            createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          },
          {
            _id: 'msg-peer-2',
            senderName: 'Mike Torres',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
            text: 'Grabbing a quick coffee then back to problem set 3 ☕',
            type: 'message',
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          },
          {
            _id: 'msg-peer-3',
            senderName: 'Elena Rostova',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
            text: 'Let me know if anyone wants to compare integration derivations!',
            type: 'message',
            createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          },
        ],
      };
      res.json(fallbackRoom);
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
    if (!name || !subject || !description) {
      res.status(400).json({ message: 'Name, subject, and description are required' });
      return;
    }

    const creatorName = 'Alex Mercer';
    const creatorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const newRoom = await StudyRoom.create({
      name,
      subject,
      description,
      vibe: vibe || 'Lofi Beats',
      category: category || 'STEM HUB',
      owner: req.user?.id,
      participantCount: 5,
      participants: [
        ...MOCK_STUDY_PEERS,
        {
          name: creatorName,
          avatar: creatorAvatar,
          status: 'focus',
          joinedAt: new Date(),
        },
      ],
      messages: [
        {
          senderName: 'StudySphere Bot',
          senderAvatar: '',
          text: `Welcome to ${name}! Stay focused and productive.`,
          type: 'system',
          createdAt: new Date(),
        },
        {
          senderName: 'Sarah Jenkins',
          senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
          text: `Joined ${name}! Ready for a 45m sprint.`,
          type: 'message',
          createdAt: new Date(),
        },
        {
          senderName: 'Elena Rostova',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
          text: 'Good luck! Focusing on notes.',
          type: 'message',
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
    const { name, avatar } = req.body;

    const room = await StudyRoom.findById(id);
    if (!room) {
      res.status(404).json({ message: 'Study room not found' });
      return;
    }

    const memberName = name || 'Student';
    const memberAvatar =
      avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const existingMember = room.participants.find((p) => p.name === memberName);
    if (!existingMember) {
      room.participants.push({
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
