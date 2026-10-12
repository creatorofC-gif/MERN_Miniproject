import { request } from './api';
import { User, TopSolver } from '../types';

export const usersService = {
  getLeaderboard: async (): Promise<TopSolver[]> => {
    return request<TopSolver[]>('/users/leaderboard');
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  toggleDailyGoal: async (goalIndex: number): Promise<{ title: string; completed: boolean }[]> => {
    return request<{ title: string; completed: boolean }[]>('/users/goals/toggle', {
      method: 'POST',
      body: JSON.stringify({ goalIndex }),
    });
  },
};
