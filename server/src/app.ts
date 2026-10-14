import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app: Express = express();

// Configure 'trust proxy' only if the deployment environment explicitly requires it.
// By default, trust proxy is disabled so Express will not blindly trust client-supplied headers.
if (process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
} else if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY);
}

// Parse allowed client origins strictly from environment variables (CLIENT_URL)
const rawClientUrls = process.env.CLIENT_URL || '';
const configuredOrigins = rawClientUrls
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Local development fallback origins (only active in local dev, not production)
const devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Environment-Driven Production CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      // 1. Check against origins specified in CLIENT_URL environment variable
      if (configuredOrigins.includes(normalizedOrigin) || process.env.CLIENT_URL === '*') {
        return callback(null, true);
      }

      // 2. Allow local development origins only when not in production
      if (process.env.NODE_ENV !== 'production' && devOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn(`[CORS Blocked]: Origin "${origin}" is not listed in CLIENT_URL environment variable.`);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Explicit OPTIONS preflight handling
app.options('*', cors());

// Payload size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint (browser status check for Render)
app.get('/', (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    message: '🎓 StudySphere API & WebSocket Server is Running',
    database: isDbConnected ? 'Connected' : 'Connecting...',
    dbName: mongoose.connection.name || 'StudySphere',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    name: 'StudySphere API',
    database: isDbConnected
      ? (process.env.MONGO_URI?.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB')
      : 'Disconnected',
    dbConnected: isDbConnected,
    timestamp: new Date(),
  });
});

// Global Secure Error Handler (prevents leaking internal stack traces)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err.message || err);
  const status = typeof err.status === 'number' ? err.status : 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { error: err.toString() } : {}),
  });
});

export default app;
