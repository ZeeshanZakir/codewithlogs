import type { NextAuthConfig } from "next-auth";

import { isAccessExpired } from "@/lib/roles";

const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.role = user.role ?? "admin";
        token.accessExpiresAt = user.accessExpiresAt ?? null;
      }

      // Returning null clears the session cookie once a writer account expires.
      if (isAccessExpired(token.accessExpiresAt)) {
        return null;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
        session.user.role = token.role ?? "admin";
        session.user.accessExpiresAt = token.accessExpiresAt ?? null;
      }

      return session;
    },
    authorized({ auth: session, request }) {
      const isLoggedIn = Boolean(session?.user);
      const pathname = request.nextUrl.pathname;
      const isLoginRoute = pathname === "/admin/login";
      const isAdminRoute = pathname.startsWith("/admin");

      if (isLoginRoute) {
        return true;
      }

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export default authConfig;
