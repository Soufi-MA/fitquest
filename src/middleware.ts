import { getToken } from "next-auth/jwt";
// import { withAuth } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // const authMiddleware = withAuth({
  //   pages: {
  //     signIn: `/sign-in`,
  //   },
  //   callbacks: {
  //     authorized: ({ token }) => !!token,
  //   },
  // });

  // return authMiddleware(req, event);
}
// export const config = { matcher: ["/dashboard:path*", "/sign-in"] };
