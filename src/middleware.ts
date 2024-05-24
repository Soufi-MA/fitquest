import { type NextFetchEvent, NextResponse } from "next/server";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

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
