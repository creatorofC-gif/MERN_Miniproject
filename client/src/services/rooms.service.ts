import { request } from './api';
import { StudyRoom } from '../types';

export const roomsService = {
  getRooms: async (params?: { subject?: string; vibe?: string; search?: string }): Promise<StudyRoom[]> => {
    const query = new URLSearchParams();
    if (params?.subject) query.append('subject', params.subject);
    if (params?.vibe) query.append('vibe', params.vibe);
    if (params?.search) query.append('search', params.search);
    
    const qs = query.toString();
    return request<StudyRoom[]>(`/rooms${qs ? `?${qs}` : ''}`);
  },

  getRoomById: async (id: string): Promise<StudyRoom> => {
    return request<StudyRoom>(`/rooms/${id}`);
  },

  createRoom: async (roomData: {
    name: string;
    subject: string;
    description: string;
    vibe?: string;
    category?: string;
  }): Promise<StudyRoom> => {
    return request<StudyRoom>('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  joinRoom: async (id: string, userData: { name: string; avatar: string }): Promise<StudyRoom> => {
    return request<StudyRoom>(`/rooms/${id}/join`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

export const roomService = roomsService;
