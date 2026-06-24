import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    blogUpdates: {
      type: Boolean,
      default: true,
    },
    promotions: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["popup", "homepage"],
      default: "popup",
    },
    status: {
      type: String,
      enum: ["active"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type SubscriberDocument = InferSchemaType<typeof subscriberSchema>;

export const Subscriber: Model<SubscriberDocument> =
  (mongoose.models.Subscriber as Model<SubscriberDocument> | undefined) ??
  mongoose.model<SubscriberDocument>("Subscriber", subscriberSchema);
