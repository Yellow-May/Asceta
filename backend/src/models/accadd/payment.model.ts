import { Schema, model, Document } from 'mongoose';

export interface IAccaddPayment extends Document {
  email: string;
  supabaseUserId: string;
  status: 'pending' | 'completed' | 'failed';
  amount?: number;
  paymentData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AccaddPaymentSchema = new Schema<IAccaddPayment>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    supabaseUserId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      required: true,
    },
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    paymentData: {
      type: Schema.Types.Mixed,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
AccaddPaymentSchema.index({ email: 1 });
AccaddPaymentSchema.index({ supabaseUserId: 1 });
AccaddPaymentSchema.index({ status: 1 });
AccaddPaymentSchema.index({ createdAt: -1 });

export const AccaddPayment = model<IAccaddPayment>(
  'AccaddPayment',
  AccaddPaymentSchema
);

