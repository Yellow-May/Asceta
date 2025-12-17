import { Schema, model, Document } from "mongoose";

export enum UserRole {
  STUDENT = "student",
  LECTURER = "lecturer",
  ADMIN = "admin",
}

export interface IUser extends Document {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  studentId?: string;
  staffId?: string;
  phone?: string;
  department?: string;
  jambRegNo?: string;
  waecRegNo?: string;
  waecExamDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: false,
    },
    staffId: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    jambRegNo: {
      type: String,
      required: false,
    },
    waecRegNo: {
      type: String,
      required: false,
    },
    waecExamDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        const { _id, __v, passwordHash, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Create indexes
// Note: email index is already created by unique: true in schema definition
UserSchema.index({ studentId: 1 });
UserSchema.index({ staffId: 1 });
UserSchema.index({ role: 1 });

export const User = model<IUser>("User", UserSchema);
