import { request } from './api';
import { User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async (): Promise<User> => {
    return request<User>('/auth/me');
  },
};
