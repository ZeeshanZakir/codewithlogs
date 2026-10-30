import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const affiliateLinkSchema = new Schema(
  {
    label: String,
    url: String,
    disclosure: String,
  },
  { _id: false }
);

const headingSchema = new Schema(
  {
    id: String,
    text: String,
    level: Number,
  },
  { _id: false }
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    coverImage: String,
    author: String,
    category: String,
    tags: [String],
    featured: Boolean,

    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },

    publishedAt: Date,
    scheduledAt: Date,
    readTime: String,

    headings: [headingSchema],
    affiliateLinks: [affiliateLinkSchema],

    // Email of the account that created the post; writers may only edit their own.
    createdBy: String,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "posts",
  }
);

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema>;

export const BlogPost: Model<BlogPostDocument> =
  (mongoose.models.BlogPost as Model<BlogPostDocument>) ||
  mongoose.model<BlogPostDocument>("BlogPost", blogPostSchema);