import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const sessionToken = request.cookies.get("better-auth.session_token")?.value || request.cookies.get("__Secure-better-auth.session_tok")?.value;

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
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
