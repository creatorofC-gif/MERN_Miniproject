import { Request, Response } from 'express';
import { Doubt } from '../models/Doubt.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getDoubts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, urgent, search } = req.query;
    const filter: any = {};

    if (subject && subject !== 'All Subjects') {
      filter.subject = subject;
    }

    if (urgent === 'true') {
      filter.isUrgent = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching doubts' });
  }
};

export const getDoubtById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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
    if (!title || !description || !subject) {
      res.status(400).json({ message: 'Title, description, and subject are required' });
      return;
    }

    const newDoubt = await Doubt.create({
      title,
      description,
      codeSnippet,
      authorName: req.body.authorName || 'Alex Mercer',
      authorAvatar: req.body.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorTier: 'Scholar',
      authorId: req.user?.id,
      subject,
      tags: tags || [subject],
      pointsReward: pointsReward || (isUrgent ? 150 : 50),
      isUrgent: !!isUrgent,
      aiHelpTimerSeconds: 270,
    });

    res.status(201).json(newDoubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating doubt' });
  }
};

export const claimDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }

    doubt.status = 'claimed';
    doubt.claimedBy = {
      userId: req.user?.id as any,
      name: req.body.solverName || 'Alex Mercer',
    };
    await doubt.save();

    res.json(doubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error claiming doubt' });
  }
};

export const addAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, authorName, authorAvatar } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Answer content is required' });
      return;
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }

    doubt.answers.push({
      authorName: authorName || 'Alex Mercer',
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorTier: 'Master Tier',
      content,
      isAccepted: false,
      upvotes: 0,
      createdAt: new Date(),
    });

    doubt.status = 'solved';
    await doubt.save();

    res.status(201).json(doubt);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error adding answer' });
  }
};

export const voteDoubt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Doubt not found' });
      return;
    }

    doubt.upvotes += 1;
    await doubt.save();
    res.json({ upvotes: doubt.upvotes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error voting doubt' });
  }
};
