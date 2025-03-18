import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/character", "/settings"]

// Paths that should redirect to dashboard if already authenticated
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const path = request.nextUrl.pathname

  // Check if user is authenticated
  const isAuthenticated = token ? await verifyToken(token) : false

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some((authPath) => path.startsWith(authPath))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Add CSRF protection headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
  )

  return response
}

// Verify JWT token
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

