import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    return NextResponse.next();
  }

  const origin = request.headers.get("Origin");
  if (origin === null || origin !== process.env.NEXT_PUBLIC_SERVER_URL) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}
