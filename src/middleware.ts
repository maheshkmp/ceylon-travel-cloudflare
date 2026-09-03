import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
]);

// Routes that require admin role
const ADMIN_PATHS = /^\/admin(\/|$)/;

// ─── Affiliate Cookie Settings ─────────────────────────────────────────────
const AFFILIATE_COOKIE   = "affiliate_code";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days (default)
const API_URL            = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow public paths and static files through immediately
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // ── Affiliate Referral Tracking ──────────────────────────────────────────
  const refCode        = searchParams.get("ref");
  const existingCookie = request.cookies.get(AFFILIATE_COOKIE)?.value;

  if (refCode) {
    // 1. Strip ?ref= from the URL so canonical links stay clean
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("ref");

    const response = NextResponse.redirect(cleanUrl, { status: 302 });

    // 2. Set first-touch cookie only — don't overwrite an existing referral
    if (!existingCookie) {
      response.cookies.set(AFFILIATE_COOKIE, refCode, {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        maxAge:   COOKIE_MAX_AGE_SEC,
      });
    }

    // 3. Fire-and-forget: record the click in the background (non-blocking)
    const ip      = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
                  ?? request.headers.get("x-real-ip")
                  ?? "unknown";
    const referer = request.headers.get("referer") ?? undefined;

    fetch(`${API_URL}/api/v1/affiliates/track`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        code:        refCode,
        referer,
        landingPath: pathname,
        ipAddress:   ip,
      }),
    }).catch(() => {
      // Silently ignore tracking failures — never block page loads
    });

    return response;
  }

  // ── Standard Middleware: request ID + security headers ───────────────────
  const requestId =
    request.headers.get("x-request-id") ??
    crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
