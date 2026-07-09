import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const TOOLS_HOST = "tools.codewithlogs.com";
const MAIN_HOSTS = ["codewithlogs.com", "www.codewithlogs.com"];

export default auth((request) => {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const pathname = request.nextUrl.pathname;

  // 1. Main domain: /tools now lives on the subdomain → redirect away
  if (
    MAIN_HOSTS.includes(host) &&
    (pathname === "/tools" || pathname.startsWith("/tools/"))
  ) {
    const rest = pathname.replace(/^\/tools/, ""); // "" or "/json-formatter"
    return NextResponse.redirect(`https://tools.codewithlogs.com${rest}`, 308);
  }

  // 2. Subdomain: serve the /tools section
  if (host === TOOLS_HOST) {
    const isAsset = pathname.includes(".");
    if (pathname.startsWith("/tools") || isAsset) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/tools" : `/tools${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Auth protection — ONLY for /admin routes
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
