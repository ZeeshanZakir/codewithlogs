import "server-only";

import type { GalleryPinItem, GalleryPinsResult } from "@/lib/gallery-types";
import dbConnect from "@/lib/mongodb";
import { GalleryPin } from "@/lib/gallery-pin";

type GalleryQueryOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

function normalizeGalleryPin(document: {
  _id: { toString(): string };
  title: string;
  images: string[];
  description?: string;
  createdAt: Date;
}): GalleryPinItem {
  return {
    id: document._id.toString(),
    title: document.title,
    images: document.images,
    description: document.description ?? "",
    createdAt: document.createdAt.toISOString(),
  };
}

export async function getGalleryPins(
  options: GalleryQueryOptions = {},
): Promise<GalleryPinsResult> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(24, Math.max(1, options.limit ?? 15));
  const search = options.search?.trim() ?? "";

  await dbConnect();

  const filter = search
    ? {
        $text: {
          $search: search,
        },
      }
    : {};

  const [items, total] = await Promise.all([
    GalleryPin.find(filter)
      .sort(search ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    GalleryPin.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: items.map((item) =>
      normalizeGalleryPin(item as Parameters<typeof normalizeGalleryPin>[0]),
    ),
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
