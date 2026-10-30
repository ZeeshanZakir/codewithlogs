import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

import { auth } from "@/auth";
import { getRole } from "@/lib/roles";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_FILES_PER_PIN = 12;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFileName(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || getRole(session) !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Gallery upload is not configured. Add BLOB_READ_WRITE_TOKEN to your environment variables.",
      },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_PIN) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_FILES_PER_PIN} images per pin.` },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Unsupported image type. Upload JPG, PNG, WEBP, or GIF." },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Each image must be 8MB or smaller." },
          { status: 400 },
        );
      }
    }

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await sharp(buffer)
          .rotate()
          .resize({
            width: 1600,
            withoutEnlargement: true,
          })
          .webp({ quality: 84 })
          .toBuffer();

        const baseName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
        const blob = await put(`gallery/${baseName || "image"}.webp`, optimizedBuffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: "image/webp",
        });

        return blob.url;
      }),
    );

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Server error while uploading gallery images.",
      },
      { status: 500 },
    );
  }
}
