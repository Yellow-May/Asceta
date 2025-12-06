/**
 * Example: How to use MongoDB in your application
 * 
 * This file demonstrates how to create and use MongoDB models
 * alongside your existing PostgreSQL entities.
 */

import { Schema, model, Model } from 'mongoose';
import { getMongoDBConnection } from './mongodb';

// Example: MongoDB Schema for logging/analytics
interface ILogEntry {
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const LogEntrySchema = new Schema<ILogEntry>({
  action: { type: String, required: true },
  userId: { type: String, required: false },
  metadata: { type: Schema.Types.Mixed, required: false },
  timestamp: { type: Date, default: Date.now },
});

// Create index for faster queries
LogEntrySchema.index({ timestamp: -1 });
LogEntrySchema.index({ userId: 1 });

// Export the model
export const LogEntry = model<ILogEntry>('LogEntry', LogEntrySchema);

// Example: Usage in a controller
/*
import { LogEntry } from '../config/mongodb-example';
import { getMongoDBStatus } from '../config/mongodb';

export async function logUserAction(action: string, userId: string, metadata?: any) {
  // Check if MongoDB is connected before using it
  const mongoStatus = getMongoDBStatus();
  
  if (!mongoStatus.connected) {
    console.warn('MongoDB not available, skipping log entry');
    return;
  }

  try {
    const logEntry = new LogEntry({
      action,
      userId,
      metadata,
      timestamp: new Date(),
    });
    
    await logEntry.save();
    console.log('Action logged successfully');
  } catch (error) {
    console.error('Failed to log action:', error);
    // Don't throw - logging failures shouldn't break the application
  }
}
*/

