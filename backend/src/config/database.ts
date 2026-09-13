import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (!config.mongodbUri) {
    console.log('[Database] No MONGODB_URI provided in environment. Running with local persistent data engine.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log('[Database] Successfully connected to MongoDB cluster.');
    return true;
  } catch (error) {
    console.warn('[Database] Unable to connect to MongoDB cluster. Gracefully switching to persistent local store.', (error as Error).message);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
