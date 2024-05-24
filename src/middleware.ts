import { NextFetchEvent, NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

export default async function middleware(
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  if (pathname.startsWith("/sign-in") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const authMiddleware = withAuth(
    async (req: NextRequestWithAuth) => {
      const requestForNextAuth = {
        headers: {
          cookie: req.headers.get("cookie"),
        },
      };

      // const session = await getSession({ req: requestForNextAuth as any });
      const isSetup = req.nextauth?.token?.isSetup ?? false;

      if (pathname.startsWith("/dashboard")) {
        if (!isSetup) {
          return NextResponse.redirect(new URL("/signup-flow", request.url));
        }
      }

      if (pathname.startsWith("/signup-flow")) {
        if (isSetup) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    },
    {
      pages: {
        signIn: "/sign-in",
      },
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    },
  );

  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/dashboard", "/signup-flow", "/sign-in"],
};
