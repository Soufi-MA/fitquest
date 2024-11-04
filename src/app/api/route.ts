import { github, google } from "@/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const nextCookies = await cookies();
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");

  if (!provider || (provider !== "google" && provider !== "github")) {
    return new Response("Invalid provider", { status: 400 });
  }

  const state = generateState();

  if (provider === "github") {
    const scopes = ["user:email"];

    nextCookies.set(`github_oauth_state`, state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    const url = github.createAuthorizationURL(state, scopes);

    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
      },
    });
  }

  if (provider === "google") {
    const codeVerifier = generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];

    nextCookies.set(`google_oauth_state`, state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    const url = google.createAuthorizationURL(state, codeVerifier, scopes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
      },
    });
  }

  return new Response("Internal Error", { status: 500 });
}
