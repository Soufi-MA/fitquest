import { github, gitHubErrorMessages } from "@/lib/auth";
import { cookies } from "next/headers";
import { ArcticFetchError, OAuth2RequestError, OAuth2Tokens } from "arctic";
import { db } from "@/db/connection";
import { and, eq } from "drizzle-orm";
import { clearAuthCookies, postMessageScript } from "@/lib/auth";
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
  const storedState = nextCookies.get("github_oauth_state")?.value ?? null;

  if (error) {
    const errorResponse = gitHubErrorMessages[error];
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

  if (!code || !state || !storedState || state !== storedState) {
    clearAuthCookies();
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user: GitHubUser = await response.json();

    const emailListRequest = new Request("https://api.github.com/user/emails");
    emailListRequest.headers.set("Authorization", `Bearer ${accessToken}`);
    const emailListResponse = await fetch(emailListRequest);
    const emailListResult: unknown = await emailListResponse.json();
    if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }
    let email: string | null = null;
    for (const emailRecord of emailListResult) {
      const emailParser = new ObjectParser(emailRecord);
      const primaryEmail = emailParser.getBoolean("primary");
      const verifiedEmail = emailParser.getBoolean("verified");
      if (primaryEmail && verifiedEmail) {
        email = emailParser.getString("email");
      }
    }
    if (email === null) {
      return new Response("Please verify your GitHub email address.", {
        status: 400,
      });
    }

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
            name: user.name,
            email: email,
            profilePicture: user.avatar_url,
          })
          .returning({ id: userTable.id });

        await tx.insert(accountTable).values({
          providerId: "github",
          providerUserId: user.id.toString(),
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
    console.log(e);
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
    if (e instanceof ArcticFetchError) {
      return new Response(
        postMessageScript(
          false,
          400,
          e.message ?? "There was an issue on our end. Please try again later."
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

interface GitHubUser {
  id: number;
  name: string;
  avatar_url: string;
}
