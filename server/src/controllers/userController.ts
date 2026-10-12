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

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (year) user.year = year;
    if (branch) user.branch = branch;
    if (college) user.college = college;
    if (avatar) user.avatar = avatar;

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
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.dailyGoals[goalIndex]) {
      user.dailyGoals[goalIndex].completed = !user.dailyGoals[goalIndex].completed;
      await user.save();
    }

    res.json(user.dailyGoals);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating goal' });
  }
};
