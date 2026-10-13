import { request } from './api';
import { Doubt } from '../types';

export const doubtsService = {
  getDoubts: async (params?: { subject?: string; urgent?: boolean; search?: string }): Promise<Doubt[]> => {
    const query = new URLSearchParams();
    if (params?.subject) query.append('subject', params.subject);
    if (params?.urgent !== undefined) query.append('urgent', String(params.urgent));
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    return request<Doubt[]>(`/doubts${qs ? `?${qs}` : ''}`);
  },

  getDoubtById: async (id: string): Promise<Doubt> => {
    return request<Doubt>(`/doubts/${id}`);
  },

  createDoubt: async (doubtData: {
    title: string;
    description: string;
    codeSnippet?: string;
    subject: string;
    tags?: string[];
    pointsReward?: number;
    isUrgent?: boolean;
    authorName?: string;
    authorAvatar?: string;
  }): Promise<Doubt> => {
    return request<Doubt>('/doubts', {
      method: 'POST',
      body: JSON.stringify(doubtData),
    });
  },

  claimDoubt: async (id: string, solverName: string): Promise<Doubt> => {
    return request<Doubt>(`/doubts/${id}/claim`, {
      method: 'POST',
      body: JSON.stringify({ solverName }),
    });
  },

  addAnswer: async (
    id: string,
    answerDataOrText: { content: string; authorName?: string; authorAvatar?: string } | string
  ): Promise<Doubt> => {
    const payload = typeof answerDataOrText === 'string'
      ? { content: answerDataOrText, authorName: 'Scholar' }
      : answerDataOrText;

    return request<Doubt>(`/doubts/${id}/answers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  voteDoubt: async (id: string): Promise<{ upvotes: number }> => {
    return request<{ upvotes: number }>(`/doubts/${id}/vote`, {
      method: 'POST',
    });
  },

  upvoteDoubt: async (id: string): Promise<{ upvotes: number }> => {
    return doubtsService.voteDoubt(id);
  },
};

export const doubtService = doubtsService;
