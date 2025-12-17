import { Schema, model, Document } from "mongoose";

export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export interface INews extends Document {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status: NewsStatus;
  publishDate?: Date;
  authorId: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(NewsStatus),
      default: NewsStatus.DRAFT,
      required: true,
    },
    publishDate: {
      type: Date,
      required: false,
    },
    authorId: {
      type: String,
      required: true,
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
NewsSchema.index({ authorId: 1 });
NewsSchema.index({ status: 1 });
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ title: "text" });

export const News = model<INews>("News", NewsSchema);
