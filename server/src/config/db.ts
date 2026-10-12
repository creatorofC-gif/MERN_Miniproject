import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studysphere';

export const connectDB = async (): Promise<boolean> => {
  const isAtlas = MONGO_URI.includes('mongodb.net') || MONGO_URI.startsWith('mongodb+srv://');
  console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'MongoDB'}...`);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
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
