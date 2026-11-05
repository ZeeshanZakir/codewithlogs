import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSubmissionSchema } from "@/lib/contact";
import { ContactMessage } from "@/lib/contact-message";
import dbConnect from "@/lib/mongodb";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MIN_FILL_TIME_MS = 3000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function clientIpHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.CONTACT_RATE_LIMIT_SALT || process.env.NEXTAUTH_SECRET || "codewithlogs-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

type Notification = { name: string; email: string; company: string; service: string; budget: string; message: string };

async function sendContactNotification(payload: Notification) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "info@codewithlogs.com";
  if (!resendApiKey) return false;

  const resend = new Resend(resendApiKey);
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.company || "Not provided"],
    ["Service", payload.service],
    ["Budget", payload.budget],
  ].map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("");

  const { error } = await resend.emails.send({
    from: "CodeWithLogs New Message <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: payload.email,
    subject: `New enquiry from ${payload.name.replace(/[\r\n]/g, " ")}: ${payload.service}`,
    html: `<h2>New project enquiry</h2>${rows}<p><strong>Project details:</strong></p><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`,
  });
  if (error) throw new Error(error.message);
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read your submission. Please try again." }, { status: 400 });
  }

  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields and try again.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { website, startedAt, ...data } = parsed.data;
  // Spam checks: a filled honeypot, or a form submitted faster than a person could type it.
  if (website || (startedAt && Date.now() - startedAt < MIN_FILL_TIME_MS)) {
    return NextResponse.json({ error: "Your message could not be sent. Please wait a moment and try again." }, { status: 400 });
  }

  try {
    await dbConnect();

    const ipHash = clientIpHash(request);
    const recent = await ContactMessage.countDocuments({ ipHash, createdAt: { $gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } });
    if (recent >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "You've sent several messages in a short time. Please wait a few minutes before trying again." },
        { status: 429, headers: { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000) } },
      );
    }

    const company = data.company?.trim() ?? "";
    const budget = data.budget || "Not specified";
    await ContactMessage.create({
      name: data.name,
      email: data.email,
      // The admin inbox lists `subject`, so include the company there as well.
      subject: company ? `${data.service} — ${company}` : data.service,
      service: data.service,
      company,
      budget,
      message: data.message,
      ipHash,
      status: "unread",
      createdAt: new Date(),
    });

    // The message is already stored, so an email failure should not be reported as a failed submission.
    try {
      await sendContactNotification({ name: data.name, email: data.email, company, service: data.service, budget, message: data.message });
    } catch (error) {
      console.error("Contact notification email failed", error instanceof Error ? error.message : error);
    }

    return NextResponse.json({ message: "Thanks for reaching out. We've received your message and will reply by email." }, { status: 200 });
  } catch (error) {
    console.error("Contact submission failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again shortly or email us directly." },
      { status: 500 },
    );
  }
}
