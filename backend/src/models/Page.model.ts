import { Schema, model, Document } from "mongoose";

export interface IPage extends Document {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        const { _id, __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Create indexes
// Note: slug index is already created by unique: true in schema definition
PageSchema.index({ title: "text" });

export const Page = model<IPage>("Page", PageSchema);
