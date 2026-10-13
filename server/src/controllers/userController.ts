import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('name avatar tier points streak college branch')
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching leaderboard' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { name, bio, year, branch, college, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (typeof name === 'string' && name.trim()) user.name = name.trim().slice(0, 50);
    if (typeof bio === 'string') user.bio = bio.trim().slice(0, 300);
    if (typeof year === 'string') user.year = year.trim().slice(0, 30);
    if (typeof branch === 'string') user.branch = branch.trim().slice(0, 50);
    if (typeof college === 'string') user.college = college.trim().slice(0, 100);
    if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image/'))) {
      user.avatar = avatar;
    }

    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

export const toggleDailyGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { goalIndex } = req.body;
    if (typeof goalIndex !== 'number' || !Number.isInteger(goalIndex) || goalIndex < 0) {
      res.status(400).json({ message: 'Valid goalIndex number is required' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.dailyGoals && user.dailyGoals[goalIndex]) {
      user.dailyGoals[goalIndex].completed = !user.dailyGoals[goalIndex].completed;
      await user.save();
    }

    res.json(user.dailyGoals);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating goal' });
  }
};
