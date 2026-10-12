import { Request, Response } from 'express';

export const summarizeNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, subject } = req.body;
    if (!text) {
      res.status(400).json({ message: 'Text or notes required for summarization' });
      return;
    }

    const summary = `### Summary for ${subject || 'Study Notes'}\n\n1. **Core Concept**: ${text.slice(0, 120)}...\n2. **Key Takeaway**: Apply systematic step-by-step resolution and verify core equations.\n3. **Quick Formula / Logic**: Check boundary conditions, convergence criteria, and state invariants.`;

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
    res.json({ success: true, message: `Thank you! ${email || 'You'} have been added to the early access list.` });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering for AI waitlist' });
  }
};
