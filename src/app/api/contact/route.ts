import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactFormSchema } from "@/lib/contact";
import { ContactMessage } from "@/lib/contact-message";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

async function sendContactNotification(
  payload: Parameters<typeof ContactMessage.create>[0] & {
    email: string;
    name: string;
    subject: string;
    budget: string;
    message: string;
  },
) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!resendApiKey || !contactEmail) {
    return false;
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Contact Form <onboarding@resend.dev>",
    to: contactEmail,
    subject: `New message from ${payload.name}: ${payload.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Subject:</strong> ${payload.subject}</p>
      <p><strong>Budget:</strong> ${payload.budget}</p>
      <p><strong>Message:</strong> ${payload.message}</p>
    `,
  });

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid form submission.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const submission = await ContactMessage.create({
      ...parsed.data,
      status: "unread",
      createdAt: new Date(),
    });

    await sendContactNotification(submission.toObject());

    return NextResponse.json(
      {
        message: "Thanks for reaching out. I will get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error while sending your message.",
      },
      { status: 500 },
    );
  }
}
