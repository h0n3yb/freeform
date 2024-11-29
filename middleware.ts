import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow public access to the home page
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // Handle other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to home page
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/", "/student/:path*", "/instructor/:path*"],
}; 