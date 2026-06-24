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
  try {
    const body = await request.json();
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
        message: "You are subscribed for blog updates and promotions.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error while saving your subscription.",
      },
      { status: 500 },
    );
  }
}
