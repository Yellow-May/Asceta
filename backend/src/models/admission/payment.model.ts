import { Schema, model, Document } from "mongoose";

export interface IAdmissionPayment extends Document {
  email: string;
  supabaseUserId: string;
  paymentType: "application_fee" | "acceptance_fee" | "other";
  status: "pending" | "completed" | "failed";
  amount: number;
  paymentData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionPaymentSchema = new Schema<IAdmissionPayment>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    supabaseUserId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["application_fee", "acceptance_fee", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentData: {
      type: Schema.Types.Mixed,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
// Note: email, supabaseUserId, status, and paymentType fields don't have index: true in schema, so we create them here
AdmissionPaymentSchema.index({ email: 1 });
AdmissionPaymentSchema.index({ supabaseUserId: 1 });
AdmissionPaymentSchema.index({ status: 1 });
AdmissionPaymentSchema.index({ paymentType: 1 });
AdmissionPaymentSchema.index({ createdAt: -1 });

export const AdmissionPayment = model<IAdmissionPayment>(
  "AdmissionPayment",
  AdmissionPaymentSchema,
  "admission-payments"
);
