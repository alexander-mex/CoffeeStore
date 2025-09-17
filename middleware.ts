import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/") && request.nextUrl.pathname !== "/admin") {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/products/:path*", "/admin/news/:path*"],
}
