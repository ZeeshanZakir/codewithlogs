import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "@/auth.config";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function stripWrappingQuotes(value?: string) {
  if (!value) {
    return value;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function isBcryptHash(value?: string) {
  return Boolean(value && BCRYPT_HASH_PATTERN.test(value));
}

function readRawEnvValue(name: string) {
  const envFiles = [".env.local", ".env"];

  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);

    try {
      const content = fs.readFileSync(envPath, "utf8");
      const line = content
        .split(/\r?\n/)
        .find((entry) => entry.startsWith(`${name}=`));

      if (!line) {
        continue;
      }

      return stripWrappingQuotes(line.slice(name.length + 1).trim());
    } catch {
      // Ignore missing env files in deployed environments.
    }
  }

  return undefined;
}

function getAdminPasswordHash() {
  const loadedHash = stripWrappingQuotes(process.env.ADMIN_PASSWORD_HASH);

  if (isBcryptHash(loadedHash)) {
    return loadedHash;
  }

  // Next expands `$VAR` inside .env files. This fallback preserves raw bcrypt
  // hashes like `$2b$...` when they were pasted without escaping `$`.
  const rawHash = readRawEnvValue("ADMIN_PASSWORD_HASH");

  if (isBcryptHash(rawHash)) {
    return rawHash;
  }

  return loadedHash;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = getAdminPasswordHash();

        if (!adminEmail || !adminPasswordHash) {
          return null;
        }

        const emailMatches =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          adminPasswordHash,
        );

        if (!emailMatches || !passwordMatches) {
          return null;
        }

        return {
          id: "admin",
          name: "Zeeshan Zakir",
          email: adminEmail,
        };
      },
    }),
  ],
});
