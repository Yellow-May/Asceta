import { Schema, model, Document } from "mongoose";

export interface IAdmissionDocument extends Document {
  supabaseUserId: string;
  email: string;
  documentType:
    | "passport_photo"
    | "olevel_first"
    | "olevel_second"
    | "jamb_result"
    | "birth_certificate"
    | "lga_identification"
    | "other";
  file: {
    url: string;
    public_id: string;
    originalName?: string;
  };
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionDocumentSchema = new Schema<IAdmissionDocument>(
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
    documentType: {
      type: String,
      enum: [
        "passport_photo",
        "olevel_first",
        "olevel_second",
        "jamb_result",
        "birth_certificate",
        "lga_identification",
        "other",
      ],
      required: true,
    },
    file: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: false,
      },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index (individual indexes are already created by index: true in schema)
AdmissionDocumentSchema.index({ supabaseUserId: 1, documentType: 1 });

export const AdmissionDocument = model<IAdmissionDocument>(
  "AdmissionDocument",
  AdmissionDocumentSchema,
  "admission-documents"
);
