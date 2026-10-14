import { request } from './api';

export const aiService = {
  summarize: async (
    text: string,
    subject?: string
  ): Promise<{ summary: string; bulletPoints?: string[]; flashcards: { question: string; answer: string }[] }> => {
    return request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ text, subject }),
    });
  },

  registerWaitlist: async (email: string): Promise<{ success: boolean; message: string }> => {
    return request('/ai/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
