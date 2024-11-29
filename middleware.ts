import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  const isApiUploadRoute = request.nextUrl.pathname.startsWith("/api/upload");
  const isHomePage = request.nextUrl.pathname === "/";

  // Allow home page
  if (isHomePage) {
    return NextResponse.next();
  }

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Allow API upload route for authenticated users
  if (isApiUploadRoute) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/student", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 