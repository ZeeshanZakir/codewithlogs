import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const galleryPinSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator(value: string[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Gallery pins require at least one image.",
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: "galleryPins",
  },
);

galleryPinSchema.index({ title: "text" });

export type GalleryPinDocument = InferSchemaType<typeof galleryPinSchema>;

export const GalleryPin: Model<GalleryPinDocument> =
  (mongoose.models.GalleryPin as Model<GalleryPinDocument> | undefined) ??
  mongoose.model<GalleryPinDocument>("GalleryPin", galleryPinSchema);
