import type { NextAuthConfig } from "next-auth";

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
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
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
