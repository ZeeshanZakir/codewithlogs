import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { auth } from "@/auth";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const session = await auth();
    console.log("SESSION:", session);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Upload JPG, PNG, WEBP, or GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Max upload size is 5MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const webpFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .webp({ quality: 80 })
      .toBuffer();

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`blog/${webpFileName}`, optimizedBuffer, {
        access: "public",
        addRandomSuffix: false,
        contentType: "image/webp",
      });

      return NextResponse.json({ url: blob.url });
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "blog");

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, webpFileName);
    await fs.writeFile(filePath, optimizedBuffer);

    return NextResponse.json({ url: `/images/blog/${webpFileName}` });
  } catch (error) {
    console.error("UPLOAD ERROR FULL:", error);

if (error instanceof Error) {
  console.error(error.message);
  console.error(error.stack);
}

    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Image upload is not configured for production. Add BLOB_READ_WRITE_TOKEN in Vercel project settings.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
  {
    error:
      error instanceof Error
        ? error.message
        : "Unknown error",
  },
  { status: 500 }
);
  }
}
