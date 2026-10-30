// Create, extend or revoke a temporary content-writer login for the CMS.
//
//   node --env-file=.env.local scripts/create-writer.mjs writer@example.com
//   node --env-file=.env.local scripts/create-writer.mjs writer@example.com --days 7
//   node --env-file=.env.local scripts/create-writer.mjs writer@example.com --revoke
//
// Writers can only open Manage Posts and New Post, create posts, and edit the
// posts they created. Creating again for the same email issues a new password
// and restarts the expiry window.

import { randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const DEFAULT_DAYS = 30;

function parseArgs(argv) {
  const [email, ...rest] = argv;
  const daysIndex = rest.indexOf("--days");
  const days = daysIndex === -1 ? DEFAULT_DAYS : Number(rest[daysIndex + 1]);

  return {
    email: email?.trim().toLowerCase(),
    days,
    revoke: rest.includes("--revoke"),
  };
}

function generatePassword() {
  // 18 random bytes -> 24 URL-safe characters.
  return randomBytes(18).toString("base64url");
}

async function main() {
  const { email, days, revoke } = parseArgs(process.argv.slice(2));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Usage: node --env-file=.env.local scripts/create-writer.mjs <email> [--days N] [--revoke]");
    process.exitCode = 1;
    return;
  }

  if (!Number.isFinite(days) || days <= 0) {
    console.error("--days must be a positive number.");
    process.exitCode = 1;
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Run with --env-file=.env.local.");
    process.exitCode = 1;
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const profiles = mongoose.connection.db.collection("profile");

  try {
    const existing = await profiles.findOne({ email });

    // Never touch the admin profile (it has no role or role "admin").
    if (existing && existing.role !== "writer") {
      console.error(`${email} is an admin account. Use a different email for the writer.`);
      process.exitCode = 1;
      return;
    }

    if (revoke) {
      if (!existing) {
        console.log(`No writer account found for ${email}.`);
        return;
      }

      await profiles.deleteOne({ _id: existing._id, role: "writer" });
      console.log(`Writer access for ${email} has been revoked.`);
      return;
    }

    const password = generatePassword();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    await profiles.updateOne(
      { email },
      {
        $set: {
          email,
          password: await bcrypt.hash(password, 12),
          role: "writer",
          expiresAt,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );

    console.log("");
    console.log(existing ? "Writer account updated." : "Writer account created.");
    console.log(`  Login:    ${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/login`);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Expires:  ${expiresAt.toLocaleString()}`);
    console.log("");
    console.log("The password is shown only once. Share it privately.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
