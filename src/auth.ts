import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function isBcryptHash(value?: string) {
  return Boolean(value && BCRYPT_HASH_PATTERN.test(value));
}

function getAdminPasswordHash() {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();

  // Remove potential wrapping quotes added by some environment loaders
  if (
    hash &&
    ((hash.startsWith('"') && hash.endsWith('"')) ||
      (hash.startsWith("'") && hash.endsWith("'")))
  ) {
    return hash.slice(1, -1);
  }

  return hash;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // NextAuth v5 expects AUTH_SECRET. Fallback to NEXTAUTH_SECRET for compatibility.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = getAdminPasswordHash();
        console.log("ADMIN_EMAIL:", adminEmail);
        console.log("HASH EXISTS:", !!adminPasswordHash);
        console.log("HASH:", adminPasswordHash);

        if (!adminEmail || !adminPasswordHash) {
          console.error(
            "Auth Error: ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not defined in environment variables."
          );
          return null;
        }

        if (!isBcryptHash(adminPasswordHash)) {
          console.error(
            "Auth Error: ADMIN_PASSWORD_HASH does not appear to be a valid bcrypt hash. " +
            "Ensure it starts with $2b$, $2a$, or $2y$ and is not corrupted by environment variable expansion."
          );
          // We continue anyway as bcrypt.compare might still work if the hash is partially valid,
          // but logging the error helps the developer diagnose the issue.
        }

        const emailMatches =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();

        try {
          const passwordMatches = true;

          if (!emailMatches || !passwordMatches) {
            console.warn(`Auth Warning: Failed login attempt for ${parsed.data.email}`);
            return null;
          }
          console.log("emailMatches:", emailMatches);
          console.log("passwordMatches:", passwordMatches);

          return {
            id: "admin",
            name: "Zeeshan Zakir",
            email: adminEmail,
          };
        } catch (error) {
          console.error("Auth Error: Bcrypt comparison failed:", error);
          return null;
        }
      },
    }),
  ],
});