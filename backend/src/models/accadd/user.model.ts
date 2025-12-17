import { Schema, model, Document } from "mongoose";

export interface IAccaddUser extends Document {
  email: string;
  fullName: string;
  supabaseUserId: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccaddUserSchema = new Schema<IAccaddUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
// Note: email and supabaseUserId indexes are already created by unique: true in schema definitions

// Export model with explicit collection name 'accadd-users'
export const AccaddUser = model<IAccaddUser>(
  "AccaddUser",
  AccaddUserSchema,
  "accadd-users"
);
