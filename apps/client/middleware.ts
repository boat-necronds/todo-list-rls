import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.includes(path);

  // Check for better-auth session cookie - using the correct cookie name
  const hasSession = request.cookies.has("better-auth.session_token");

  // Log information that will be visible in the server console
  console.log(
    `[Middleware] Path: ${path}, Has Session: ${hasSession}, Is Public: ${isPublicRoute}`
  );

  // Log all cookies for debugging
  const allCookies = request.cookies.getAll();
  console.log("[Middleware] All cookies:", JSON.stringify(allCookies, null, 2));

  // If there's no session and the route is not public, redirect to sign-in
  if (!hasSession && !isPublicRoute) {
    console.log("[Middleware] Redirecting to sign-in (no session)");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If there's a session and trying to access public routes, redirect to profile
  if (hasSession && isPublicRoute) {
    console.log("[Middleware] Redirecting to profile (has session)");
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Allow the request to proceed
  console.log("[Middleware] Allowing request to proceed");
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
