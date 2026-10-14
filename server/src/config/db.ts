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

  const isAtlas = cleanUri.includes('mongodb.net') || cleanUri.startsWith('mongodb+srv://');

  if (isAtlas) {
    // Rebuild Atlas URI: keep scheme+credentials+host, take the db name from the path (default StudySphere),
    // and discard any malformed query such as `/?studysphere=Cluster0` or `w=majority=Cluster0`.
    const m = cleanUri.match(/^(mongodb(?:\+srv)?:\/\/[^\/?]+)(?:\/([^?]*))?/);
    if (m) {
      const dbName = m[2] && m[2].trim() ? m[2] : 'StudySphere';
      cleanUri = `${m[1]}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    }
  }

  try {
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    };

    if (isAtlas) {
      options.retryWrites = true;
      options.w = 'majority';
      // If no database name was provided in the Atlas URI path, default to StudySphere
      const uriPathMatch = cleanUri.match(/mongodb(?:\+srv)?:\/\/[^\/]+\/([^?]+)/);
      if (!uriPathMatch || !uriPathMatch[1]) {
        options.dbName = 'StudySphere';
      }
    } else {
      // Local MongoDB: default to studysphere only if no database was specified in URI
      const localPathMatch = cleanUri.match(/mongodb:\/\/[^\/]+\/([^?]+)/);
      if (!localPathMatch || !localPathMatch[1]) {
        options.dbName = 'studysphere';
      }
    }

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
