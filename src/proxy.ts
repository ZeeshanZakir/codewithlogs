import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { canAccessAdminPath, getHomePath, getRole } from "@/lib/roles";

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

  const role = getRole(request.auth);

  if (isLoggedIn && isLoginRoute) {
    return NextResponse.redirect(new URL(getHomePath(role), request.url));
  }

  if (isLoggedIn && !canAccessAdminPath(role, pathname)) {
    return NextResponse.redirect(new URL(getHomePath(role), request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
