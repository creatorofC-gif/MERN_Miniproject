import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { JWT_SECRET } from '../config/jwt.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (
      !name ||
      typeof name !== 'string' ||
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      res.status(400).json({ message: 'Name, email, and password are required and must be valid strings' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || cleanEmail.length > 100) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      dailyGoals: [
        { title: 'Study 2 hours', completed: true },
        { title: 'Solve 1 Doubt', completed: false },
        { title: 'Attend 1 Study Room', completed: false },
      ],
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        tier: newUser.tier,
        points: newUser.points,
        streak: newUser.streak,
        year: newUser.year,
        branch: newUser.branch,
        college: newUser.college,
        bio: newUser.bio,
        role: newUser.role,
        dailyGoals: newUser.dailyGoals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      res.status(400).json({ message: 'Email and password are required and must be valid strings' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        tier: user.tier,
        points: user.points,
        streak: user.streak,
        year: user.year,
        branch: user.branch,
        college: user.college,
        bio: user.bio,
        role: user.role,
        dailyGoals: user.dailyGoals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error logging in' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching user' });
  }
};
