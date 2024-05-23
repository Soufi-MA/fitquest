import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log(request.nextauth.token);
    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      request.nextauth.token?.isSetup === false
    ) {
      return NextResponse.redirect(new URL("/signup-flow", request.url));
    }
    if (
      request.nextUrl.pathname.startsWith("/sign-in") &&
      request.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard"],
};
