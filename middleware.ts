import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth");
  const { pathname } = request.nextUrl;

  if (!token && pathname !== "/login" && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/buildings/:path*", "/tenants/:path*", "/contracts/:path*", "/units/:path*", "/payments/:path*", "/reports/:path*"],
};