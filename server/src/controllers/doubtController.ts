import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Doubt } from '../models/Doubt.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Sanitize user query input to prevent Regular Expression Denial of Service (ReDoS)
const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const getDoubts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, urgent, search } = req.query;
    const filter: any = {};

    if (typeof subject === 'string' && subject !== 'All Subjects' && subject !== 'All') {
      filter.subject = subject.slice(0, 100);
    }

    if (urgent === 'true') {
      filter.isUrgent = true;
    }

    if (typeof search === 'string' && search.trim()) {
      const cleanSearch = escapeRegex(search.trim().slice(0, 100));
      filter.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching doubts' });
  }
};

const getParamId = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

export const getDoubtById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParamId(req.params.id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid doubt ID' });
      return;
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }
    res.json(doubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching doubt' });
  }
};

export const createDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, codeSnippet, subject, tags, pointsReward, isUrgent } = req.body;

    if (!title || typeof title !== 'string' || !description || typeof description !== 'string' || !subject || typeof subject !== 'string') {
      res.status(400).json({ message: 'Title, description, and subject are required string fields' });
      return;
    }

    let authorName = 'Student';
    let authorAvatar = '';
    const authorId = req.user?.id;

    if (authorId) {
      try {
        const dbUser = await User.findById(authorId);
        if (dbUser) {
          authorName = dbUser.name;
          authorAvatar = dbUser.avatar;
        }
      } catch {
        if (req.user?.email) {
          authorName = req.user.email.split('@')[0];
        }
      }
    }

    const safeTags = Array.isArray(tags)
      ? tags.filter((t) => typeof t === 'string').map((t) => t.slice(0, 30))
      : [subject.slice(0, 30)];

    const newDoubt = await Doubt.create({
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 5000),
      codeSnippet: typeof codeSnippet === 'string' ? codeSnippet.slice(0, 10000) : undefined,
      authorName,
      authorAvatar,
      authorTier: 'Scholar',
      authorId,
      subject: subject.trim().slice(0, 50),
      tags: safeTags,
      pointsReward: typeof pointsReward === 'number' && pointsReward > 0 ? pointsReward : (isUrgent ? 150 : 50),
      isUrgent: Boolean(isUrgent),
      aiHelpTimerSeconds: 270,
      upvotes: 0,
      upvotedBy: [],
      answers: [],
    });

    res.status(201).json(newDoubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating doubt' });
  }
};

export const claimDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getParamId(req.params.id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid doubt ID' });
      return;
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }

    let solverName = 'Student Solver';
    if (req.user?.id) {
      try {
        const dbUser = await User.findById(req.user.id);
        if (dbUser) solverName = dbUser.name;
      } catch {
        if (req.user?.email) solverName = req.user.email.split('@')[0];
      }
    }

    doubt.status = 'claimed';
    doubt.claimedBy = {
      userId: req.user?.id as any,
      name: solverName,
    };
    await doubt.save();

    res.json(doubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error claiming doubt' });
  }
};

export const addAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getParamId(req.params.id);
    const { content, authorName: bodyAuthorName, authorAvatar: bodyAuthorAvatar } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ message: 'Answer content is required string' });
      return;
    }

    let authorName = bodyAuthorName || 'Scholar';
    let authorAvatar = bodyAuthorAvatar || '';

    if (req.user?.id) {
      try {
        const dbUser = await User.findById(req.user.id);
        if (dbUser) {
          authorName = dbUser.name || authorName;
          authorAvatar = dbUser.avatar || authorAvatar;
          // Award mastery bounty points to the user
          dbUser.points = (dbUser.points || 0) + 50;
          await dbUser.save();
        }
      } catch {
        if (req.user?.email && !bodyAuthorName) authorName = req.user.email.split('@')[0];
      }
    }

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const doubt = await Doubt.findById(id);
      if (doubt) {
        doubt.answers.push({
          authorName,
          authorAvatar,
          authorTier: 'Master Tier',
          content: content.trim().slice(0, 5000),
          isAccepted: true,
          upvotes: 0,
          createdAt: new Date(),
        });

        doubt.status = 'solved';
        doubt.isResolved = true;
        await doubt.save();
        res.status(201).json(doubt);
        return;
      }
    }

    // Synthetic response for non-ObjectId / mock data
    const syntheticAnswer = {
      _id: `ans-${Date.now()}`,
      authorName,
      authorAvatar,
      authorTier: 'Master Tier',
      content: content.trim().slice(0, 5000),
      isAccepted: true,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      _id: id || `doubt-${Date.now()}`,
      status: 'solved',
      isResolved: true,
      answers: [syntheticAnswer],
      newAnswer: syntheticAnswer,
      message: 'Solution accepted. Mastery points awarded.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error adding answer' });
  }
};

export const voteDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getParamId(req.params.id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid doubt ID' });
      return;
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }

    const userId = req.user?.id;
    if (userId) {
      const alreadyVoted = (doubt.upvotedBy || []).some((uId: any) => uId.toString() === userId);
      if (alreadyVoted) {
        // Toggle vote off if clicked again
        doubt.upvotedBy = (doubt.upvotedBy || []).filter((uId: any) => uId.toString() !== userId);
        doubt.upvotes = Math.max(0, doubt.upvotes - 1);
        await doubt.save();
        res.json({ upvotes: doubt.upvotes, message: 'Upvote removed' });
        return;
      }

      if (!doubt.upvotedBy) doubt.upvotedBy = [];
      doubt.upvotedBy.push(userId as any);
      doubt.upvotes = (doubt.upvotes || 0) + 1;
    } else {
      doubt.upvotes = (doubt.upvotes || 0) + 1;
    }

    await doubt.save();
    res.json({ upvotes: doubt.upvotes, message: 'Upvoted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error voting doubt' });
  }
};
