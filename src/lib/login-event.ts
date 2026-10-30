import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const loginEventSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, enum: ["admin", "writer"], required: true },
    ip: String,
    city: String,
    region: String,
    country: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "loginEvents",
    versionKey: false,
  },
);

export type LoginEventDocument = InferSchemaType<typeof loginEventSchema>;

export const LoginEvent: Model<LoginEventDocument> =
  (mongoose.models.LoginEvent as Model<LoginEventDocument> | undefined) ??
  mongoose.model<LoginEventDocument>("LoginEvent", loginEventSchema);
