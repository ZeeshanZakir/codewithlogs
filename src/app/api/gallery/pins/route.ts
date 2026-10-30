import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { getRole } from "@/lib/roles";
import { getGalleryPins } from "@/lib/gallery";
import { GalleryPin } from "@/lib/gallery-pin";
import dbConnect from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createGalleryPinSchema = z.object({
  title: z.string().trim().min(2).max(160),
  images: z.array(z.string().trim().url()).min(1),
  description: z.string().trim().max(1000).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "15");
  const search = searchParams.get("search") ?? "";

  const result = await getGalleryPins({
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 15,
    search,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || getRole(session) !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createGalleryPinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid gallery pin data.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const pin = await GalleryPin.create({
      title: parsed.data.title,
      images: parsed.data.images,
      description: parsed.data.description ?? "",
      createdAt: new Date(),
    });

    revalidatePath("/gallery");

    return NextResponse.json(
      {
        id: pin._id.toString(),
        message: "Gallery pin published successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Server error while publishing gallery pin.",
      },
      { status: 500 },
    );
  }
}
