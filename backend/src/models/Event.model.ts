import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  location?: string;
  imageUrl?: string;
  createdById: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    createdById: {
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
EventSchema.index({ createdById: 1 });
EventSchema.index({ eventDate: 1 });
EventSchema.index({ title: "text" });

export const Event = model<IEvent>("Event", EventSchema);
