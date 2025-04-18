import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

<<<<<<< Updated upstream
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
=======
// ตรวจสอบว่าเป็น public route หรือไม่
const isPublicRoute = (path: string) => {
  return (
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.startsWith("/images") ||
    path === "/favicon.ico"
  );
};

// Middleware function
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ถ้าเป็น public route ให้ผ่านไปเลย
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // ตรวจสอบ session token
  const sessionToken = request.cookies.get("better-auth.session_token");

  // ถ้าไม่มี session token และไม่ใช่ public route ให้ redirect ไปที่หน้า sign-in
  if (!sessionToken && !isPublicRoute(path)) {
    console.log("No session token, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ถ้ามี session token และเป็น public route ให้ redirect ไปที่หน้า profile
  if (sessionToken && (path === "/sign-in" || path === "/sign-up")) {
    console.log("Has session token, redirecting to profile");
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // ถ้ามี session token และไม่ใช่ public route ให้ผ่านไปเลย
  return NextResponse.next();
}

// กำหนด path ที่จะใช้ middleware
>>>>>>> Stashed changes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
<<<<<<< Updated upstream
     * - api (API routes)
=======
     * - api/auth (auth API routes)
>>>>>>> Stashed changes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
<<<<<<< Updated upstream
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
=======
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
>>>>>>> Stashed changes
  ],
};
