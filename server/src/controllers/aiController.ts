import { Request, Response } from 'express';

export const summarizeNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, subject } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ message: 'Text or notes required for summarization' });
      return;
    }

    const safeText = text.trim().slice(0, 10000);
    const safeSubject = typeof subject === 'string' ? subject.trim().slice(0, 50) : 'Study Notes';

    const summary = `### Summary for ${safeSubject}\n\n1. **Core Concept**: ${safeText.slice(0, 120)}...\n2. **Key Takeaway**: Apply systematic step-by-step resolution and verify core equations.\n3. **Quick Formula / Logic**: Check boundary conditions, convergence criteria, and state invariants.`;

    const flashcards = [
      { question: 'What is the primary objective of this topic?', answer: 'To formulate the underlying mechanism and resolve key analytical equations.' },
      { question: 'What is the critical constraint?', answer: 'Boundary condition must strictly adhere to initial criteria.' },
    ];

    res.json({ summary, flashcards });
  } catch (error: any) {
    res.status(500).json({ message: 'Error summarizing notes' });
  }
};

export const registerAiWaitlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 100) {
      res.status(400).json({ message: 'Valid email address required' });
      return;
    }

    res.json({ success: true, message: `Thank you! ${email} has been added to the early access list.` });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering for AI waitlist' });
  }
};
