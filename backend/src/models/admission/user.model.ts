import { Schema, model, Document } from "mongoose";

export interface IAdmissionUser extends Document {
  email: string;
  fullName: string;
  supabaseUserId: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionUserSchema = new Schema<IAdmissionUser>(
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
    timestamps: true,
  }
);

export const AdmissionUser = model<IAdmissionUser>(
  "AdmissionUser",
  AdmissionUserSchema,
  "admission-users"
);
