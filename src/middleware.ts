import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";

  if (!isLoggedIn && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
