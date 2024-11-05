import { github, google } from "@/lib/auth";
import { cookies } from "next/headers";
import { decodeIdToken, OAuth2RequestError, OAuth2Tokens } from "arctic";
import { db } from "@/db/connection";
import { and, eq } from "drizzle-orm";
import {
  clearAuthCookies,
  googleErrorMessages,
  postMessageScript,
} from "@/lib/auth";
import { accountTable, userTable } from "@/db/schema/user";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";
import { ObjectParser } from "@pilcrowjs/object-parser";

export async function GET(request: Request): Promise<Response> {
  const nextCookies = await cookies();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const storedState = nextCookies.get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    nextCookies.get("google_code_verifier")?.value ?? null;

  if (error) {
    const errorResponse = googleErrorMessages[error];
    if (errorResponse) {
      return new Response(
        postMessageScript(false, errorResponse.status, errorResponse.message),
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    } else {
      return new Response(
        postMessageScript(
          false,
          400,
          "There was an issue on our end. Please try again later."
        ),
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  }

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    clearAuthCookies();
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens: OAuth2Tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const claims = decodeIdToken(tokens.idToken());
    const claimsParser = new ObjectParser(claims);

    const sub = claimsParser.getString("sub");
    const name = claimsParser.getString("name");
    const picture = claimsParser.getString("picture");
    const email = claimsParser.getString("email");

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    let userId: number | undefined = undefined;
    if (!existingUser) {
      await db.transaction(async (tx) => {
        const [insertedUser] = await tx
          .insert(userTable)
          .values({
            name: name,
            email: email,
            profilePicture: picture,
          })
          .returning({ id: userTable.id });

        await tx.insert(accountTable).values({
          providerId: "google",
          providerUserId: sub,
          userId: insertedUser.id,
        });
        userId = insertedUser.id;
      });
    } else {
      userId = existingUser.id;
    }

    if (userId) {
      const token = await generateSessionToken();
      const session = await createSession(token, userId);
      await setSessionTokenCookie(token, session.expiresAt);
    }
    clearAuthCookies();
    return new Response(postMessageScript(true, 200), {
      headers: { "Content-Type": "text/html" },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(
        postMessageScript(
          false,
          400,
          e.description ??
            "There was an issue on our end. Please try again later."
        ),
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }
    return new Response(
      postMessageScript(
        false,
        400,
        "There was an issue on our end. Please try again later."
      ),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
