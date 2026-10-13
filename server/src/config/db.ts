import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * TODO [Database Integration - Teammate]:
 * 1. Create a MongoDB database (either on MongoDB Atlas or locally).
 * 2. Copy `server/.env.example` to `server/.env`.
 * 3. Replace MONGO_URI with your connection string:
 *    - Atlas: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studysphere?retryWrites=true&w=majority
 *    - Local: mongodb://127.0.0.1:27017/studysphere
 * 4. Run `npm run seed --prefix server` once to populate initial study circles, users, and doubts if desired.
 */

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async (): Promise<boolean> => {
  if (!MONGO_URI || MONGO_URI.includes('YOUR_MONGODB_URI_HERE')) {
    console.log('[Database] Notice: MONGO_URI is not configured in server/.env.');
    console.log('[Database] Ready for teammate to configure MongoDB connection string. Database features are currently idle.');
    return false;
  }

  const isAtlas = MONGO_URI.includes('mongodb.net') || MONGO_URI.startsWith('mongodb+srv://');
  console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'MongoDB'}...`);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`[Database] Successfully connected to MongoDB (${isAtlas ? 'Atlas' : 'Local'}): ${conn.connection.host}`);
    console.log(`[Database] Database Name: ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.error(`[Database] MongoDB connection error: ${error.message}`);
    if (isAtlas && (MONGO_URI.includes('<username>') || MONGO_URI.includes('<password>'))) {
      console.warn(`[Database] Notice: Your MONGO_URI contains placeholder '<username>' or '<password>'. Please replace them with your actual MongoDB Atlas database user credentials in server/.env`);
    }
    return false;
  }
};
