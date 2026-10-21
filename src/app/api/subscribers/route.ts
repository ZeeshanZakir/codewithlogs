import { NextResponse } from "next/server";
import { z } from "zod";

import dbConnect from "@/lib/mongodb";
import { Subscriber } from "@/lib/subscriber";

export const runtime = "nodejs";

const subscriberSchema = z
  .object({
    email: z.string().trim().email(),
    blogUpdates: z.boolean().default(true),
    promotions: z.boolean().default(false),
    source: z.enum(["popup", "homepage"]).default("popup"),
  })
  .superRefine((input, ctx) => {
    if (!input.blogUpdates && !input.promotions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one subscription type.",
        path: ["blogUpdates"],
      });
    }
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }
  try {
    const parsed = subscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid subscription request.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const email = parsed.data.email.toLowerCase();
    const existingSubscriber = await Subscriber.findOne({ email }).lean();

    if (existingSubscriber) {
      return NextResponse.json(
        {
          alreadySubscribed: true,
          message: "This email is already subscribed.",
        },
        { status: 200 },
      );
    }

    await Subscriber.findOneAndUpdate(
      { email },
      {
        email,
        blogUpdates: parsed.data.blogUpdates,
        promotions: parsed.data.promotions,
        source: parsed.data.source,
        status: "active",
        subscribedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json(
      {
        alreadySubscribed: false,
        message: parsed.data.blogUpdates && parsed.data.promotions
          ? "You are subscribed for blog updates and promotions."
          : parsed.data.blogUpdates
            ? "You are subscribed for blog updates."
            : "You are subscribed for promotions.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Unable to save your subscription right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
