import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Alex Mercer user matching Figma screenshots
const DEFAULT_USER: User = {
  id: 'usr_1',
  _id: 'usr_1',
  name: 'Alex Mercer',
  email: 'alex@studysphere.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  tier: 'Master Tier',
  points: 1250,
  streak: 14,
  year: '3rd Year',
  branch: 'Computer Science & Math',
  college: 'Stanford University',
  bio: 'Focused on algorithms, distributed systems, and calculus.',
  role: 'student',
  dailyGoals: [
    { title: 'Study 2 hours', completed: true },
    { title: 'Solve 1 Doubt', completed: false },
    { title: 'Attend 1 Study Room', completed: false },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('studysphere_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('studysphere_token') || 'demo_token';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('studysphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studysphere_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('studysphere_token', res.token);
      localStorage.setItem('studysphere_user', JSON.stringify(res.user));
    } catch (err) {
      const demoUser: User = {
        ...DEFAULT_USER,
        name: email.split('@')[0] || 'Alex Mercer',
        email,
      };
      setToken('demo_token_signed');
      setUser(demoUser);
      localStorage.setItem('studysphere_token', 'demo_token_signed');
      localStorage.setItem('studysphere_user', JSON.stringify(demoUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('studysphere_token', res.token);
      localStorage.setItem('studysphere_user', JSON.stringify(res.user));
    } catch (err) {
      const newUser: User = {
        ...DEFAULT_USER,
        name,
        email,
      };
      setToken('demo_token_signed');
      setUser(newUser);
      localStorage.setItem('studysphere_token', 'demo_token_signed');
      localStorage.setItem('studysphere_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('studysphere_token');
    localStorage.removeItem('studysphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
