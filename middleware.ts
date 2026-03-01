import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("auth")?.value
  const { pathname } = request.nextUrl

  const publicPaths = ["/login", "/reset-password", "/auth/callback"]
  const isPublic = publicPaths.some(path => pathname.startsWith(path))

  if (!auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (auth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
