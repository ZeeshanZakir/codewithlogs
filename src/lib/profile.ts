import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const profileSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "profile",
    timestamps: true,
    versionKey: false,
  },
);

export type ProfileDocument = InferSchemaType<typeof profileSchema>;

export const Profile: Model<ProfileDocument> =
  (mongoose.models.Profile as Model<ProfileDocument> | undefined) ??
  mongoose.model<ProfileDocument>("Profile", profileSchema);
