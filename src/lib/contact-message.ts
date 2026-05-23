import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    budget: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema>;

export const ContactMessage: Model<ContactMessageDocument> =
  (mongoose.models.Contact as Model<ContactMessageDocument> | undefined) ??
  mongoose.model<ContactMessageDocument>("Contact", contactMessageSchema);
