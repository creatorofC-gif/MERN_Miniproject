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

  let cleanUri = MONGO_URI.trim().replace(/^["']|["']$/g, '');

  // Handle case where write concern was corrupted as w=majority=Cluster0 instead of w=majority&appName=Cluster0
  cleanUri = cleanUri.replace(/w=majority=Cluster0/gi, 'w=majority&appName=Cluster0');
  cleanUri = cleanUri.replace(/majority=Cluster0/gi, 'majority&appName=Cluster0');
  cleanUri = cleanUri.replace(/w=majority=[^&]*/gi, 'w=majority');

  // Handle case where database name was placed as query param /?studysphere instead of path /StudySphere?
  if (cleanUri.match(/\/?\?studysphere(\b|$)/i)) {
    cleanUri = cleanUri.replace(/\/?\?studysphere(\b|$)/i, '/StudySphere?retryWrites=true&w=majority');
  }

  const isAtlas = cleanUri.includes('mongodb.net') || cleanUri.startsWith('mongodb+srv://');
  try {
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
      dbName: 'StudySphere',
      w: 'majority',
    };

    const conn = await mongoose.connect(cleanUri, options);

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Notice: Disconnected from MongoDB. Attempting auto-reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] Reconnected to MongoDB successfully.');
    });

    console.log(`[Database] Successfully connected to MongoDB (${isAtlas ? 'Atlas Cloud' : 'Local'}): ${conn.connection.host}`);
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
