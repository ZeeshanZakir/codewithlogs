import "server-only";

import { Resend } from "resend";

import { LoginEvent } from "@/lib/login-event";
import type { AdminRole } from "@/lib/roles";

export type LoginContext = {
  ip: string;
  city: string;
  region: string;
  country: string;
  userAgent: string;
};

function header(headers: Headers, name: string) {
  const value = headers.get(name)?.trim();

  if (!value) return "";

  try {
    // Vercel URL-encodes city names (e.g. "S%C3%A3o%20Paulo").
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * IP and approximate location of the request. Location comes from the
 * geolocation headers Vercel adds in production; locally it is unknown.
 */
export function getLoginContext(request?: Request): LoginContext {
  const headers = request?.headers ?? new Headers();
  const forwardedFor = header(headers, "x-forwarded-for").split(",")[0]?.trim();

  return {
    ip: forwardedFor || header(headers, "x-real-ip") || "Unknown",
    city: header(headers, "x-vercel-ip-city") || "Unknown",
    region: header(headers, "x-vercel-ip-country-region"),
    country: header(headers, "x-vercel-ip-country") || "Unknown",
    userAgent: header(headers, "user-agent") || "Unknown",
  };
}

function describeDevice(userAgent: string) {
  const browser =
    /Edg\//.test(userAgent) ? "Edge"
    : /OPR\/|Opera/.test(userAgent) ? "Opera"
    : /Chrome\//.test(userAgent) ? "Chrome"
    : /Firefox\//.test(userAgent) ? "Firefox"
    : /Safari\//.test(userAgent) ? "Safari"
    : "Unknown browser";
  const os =
    /Windows/.test(userAgent) ? "Windows"
    : /Android/.test(userAgent) ? "Android"
    : /iPhone|iPad|iPod/.test(userAgent) ? "iOS"
    : /Mac OS X/.test(userAgent) ? "macOS"
    : /Linux/.test(userAgent) ? "Linux"
    : "Unknown OS";

  return `${browser} on ${os}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildLoginAlertEmail(email: string, role: AdminRole, context: LoginContext, at: Date) {
  const location = [context.city, context.region, context.country]
    .filter((part) => part && part !== "Unknown")
    .join(", ") || "Unknown";
  const roleLabel = role === "writer" ? "Content writer" : "Admin";
  const rows: [string, string][] = [
    ["Account", `${email} (${roleLabel})`],
    ["Time", `${at.toUTCString()}`],
    ["IP address", context.ip],
    ["Location", location],
    ["Device", describeDevice(context.userAgent)],
    ["User agent", context.userAgent],
  ];

  return {
    subject: `New CMS login: ${email} from ${location}`,
    html: `
      <h2>New login to the CodeWithLogs CMS</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="color:#64748b;vertical-align:top"><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="font-family:sans-serif;font-size:13px;color:#64748b">
        Location is approximate and based on the IP address.
        If this wasn't expected, revoke the account and change its password.
      </p>
    `,
  };
}

/**
 * Saves the login and emails an alert. Never throws: a failed alert must not
 * block the sign-in itself.
 */
export async function recordLogin(email: string, role: AdminRole, context: LoginContext) {
  const at = new Date();

  try {
    await LoginEvent.create({ email, role, ...context, createdAt: at });
  } catch (error) {
    console.error("Login alert: failed to save login event:", error);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.LOGIN_ALERT_EMAIL || process.env.CONTACT_EMAIL;

  if (!resendApiKey || !alertEmail) {
    return;
  }

  try {
    const { subject, html } = buildLoginAlertEmail(email, role, context, at);
    const { error } = await new Resend(resendApiKey).emails.send({
      from: "CodeWithLogs Security <onboarding@resend.dev>",
      to: alertEmail,
      subject,
      html,
    });

    if (error) {
      console.error("Login alert: email was not sent:", error.message);
    }
  } catch (error) {
    console.error("Login alert: email was not sent:", error);
  }
}
