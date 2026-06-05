import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "@/auth.config";
import dbConnect from "@/lib/mongodb";
import { Profile } from "@/lib/profile";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

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

        try {
          await dbConnect();

          const email = parsed.data.email.toLowerCase();
          const profile = await Profile.findOne({ email }).lean();
          console.log("Login email:", email);
          console.log("Profile found:", !!profile);
          console.log("Profile email:", profile?.email);  

          if (!profile?.password) {
            return null;
          }

          if (!BCRYPT_HASH_PATTERN.test(profile.password)) {
            console.error("Auth Error: Stored profile password is not a valid bcrypt hash.");
            return null;
          }

          const passwordMatches = await bcrypt.compare(
            parsed.data.password,
            profile.password,
          );

          if (!passwordMatches) {
            return null;
          }

          return {
            id: profile._id.toString(),
            name: profile.email,
            email: profile.email,
          };
        } catch (error) {
          console.error("Auth Error: Database-backed sign-in failed:", error);
          return null;
        }
      },
    }),
  ],
});
