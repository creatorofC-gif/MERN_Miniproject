import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const hitRecords = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of hitRecords.entries()) {
    if (now > record.resetTime) {
      hitRecords.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export const rateLimiter = (options: {
  max: number;
  windowMs: number;
  message?: string;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.baseUrl || ''}`;
    const now = Date.now();

    const record = hitRecords.get(key);

    if (!record || now > record.resetTime) {
      hitRecords.set(key, { count: 1, resetTime: now + options.windowMs });
      next();
      return;
    }

    if (record.count >= options.max) {
      res.status(429).json({
        message: options.message || 'Too many requests, please slow down.',
      });
      return;
    }

    record.count++;
    next();
  };
};
