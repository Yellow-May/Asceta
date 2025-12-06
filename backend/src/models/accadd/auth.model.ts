import { Schema, model, Document } from 'mongoose';

export interface IAccaddAuth extends Document {
  email: string;
  fullName: string;
  supabaseUserId: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccaddAuthSchema = new Schema<IAccaddAuth>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    supabaseUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
AccaddAuthSchema.index({ email: 1 });
AccaddAuthSchema.index({ supabaseUserId: 1 });

export const AccaddAuth = model<IAccaddAuth>('AccaddAuth', AccaddAuthSchema);

