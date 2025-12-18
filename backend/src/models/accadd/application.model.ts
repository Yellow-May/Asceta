import { Schema, model, Document } from "mongoose";

export interface IAccaddApplication extends Document {
  supabaseUserId: string;
  email: string;
  surname: string;
  middleName?: string;
  fullName: string;
  sex: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  dateOfBirth: Date;
  stateOfOrigin: string;
  localGovernmentArea: string;
  permanentHomeAddress: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  phone: string;
  passportPhoto: {
    url: string;
    public_id: string;
  };
  status: "pending" | "submitted" | "under_review" | "approved" | "rejected";
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccaddApplicationSchema = new Schema<IAccaddApplication>(
  {
    supabaseUserId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: false,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    stateOfOrigin: {
      type: String,
      required: true,
      trim: true,
    },
    localGovernmentArea: {
      type: String,
      required: true,
      trim: true,
    },
    permanentHomeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    nextOfKin: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      relationship: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    passportPhoto: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "under_review", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one application per user
AccaddApplicationSchema.index(
  { supabaseUserId: 1, email: 1 },
  { unique: true }
);

export const AccaddApplication = model<IAccaddApplication>(
  "AccaddApplication",
  AccaddApplicationSchema,
  "accadd-applications"
);
