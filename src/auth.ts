import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

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
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) return null;

        const emailMatches =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          adminPasswordHash
        );

        if (!emailMatches || !passwordMatches) return null;

        return {
          id: "admin",
          name: "Zeeshan Zakir",
          email: adminEmail,
        };
      },
    }),
  ],
});