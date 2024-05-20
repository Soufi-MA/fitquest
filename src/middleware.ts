import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const authMiddleware = await withAuth({
    pages: {
      signIn: `/sign-in`,
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}
export const config = { matcher: ["/dashboard:path*", "/sign-in"] };
