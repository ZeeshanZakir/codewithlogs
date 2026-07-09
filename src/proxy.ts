import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const TOOLS_HOST = "tools.codewithlogs.com";

export default auth((request) => {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // 1. Subdomain rewrite — serve /tools on tools.codewithlogs.com
  if (host === TOOLS_HOST) {
    const url = request.nextUrl.clone();
    url.pathname = `/tools${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Auth protection — ONLY for /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoggedIn = Boolean(request.auth?.user);
    const isLoginRoute = pathname === "/admin/login";

    if (!isLoggedIn && !isLoginRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
