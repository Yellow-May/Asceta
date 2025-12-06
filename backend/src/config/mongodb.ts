import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/asceta_mongodb';
const MONGODB_OPTIONS = {
  // Connection pool options
  maxPoolSize: 10,
  minPoolSize: 2,
  // Connection timeout
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // Retry options
  retryWrites: true,
  retryReads: true,
};

// Track connection state
let isConnected = false;
let connectionError: Error | null = null;

/**
 * Initialize MongoDB connection
 * Returns a promise that resolves when connection is established
 * Does not throw errors - failures are logged but don't stop the application
 */
export async function connectMongoDB(): Promise<void> {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      connectionError = null;
      console.log('MongoDB already connected');
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    
    isConnected = true;
    connectionError = null;
    console.log('MongoDB connected successfully');
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
      connectionError = err;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
      connectionError = null;
    });

  } catch (error) {
    const err = error as Error;
    console.error('Failed to connect to MongoDB:', err.message);
    isConnected = false;
    connectionError = err;
    // Don't throw - let the application continue even if MongoDB fails
  }
}

/**
 * Close MongoDB connection gracefully
 */
export async function disconnectMongoDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('MongoDB disconnected gracefully');
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
}

/**
 * Get MongoDB connection status
 */
export function getMongoDBStatus(): {
  connected: boolean;
  error: string | null;
  readyState: number;
} {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    error: connectionError?.message || null,
    readyState: mongoose.connection.readyState,
  };
}

/**
 * Get the mongoose connection instance
 * Use this to access MongoDB models and perform operations
 */
export function getMongoDBConnection(): typeof mongoose {
  return mongoose;
}

