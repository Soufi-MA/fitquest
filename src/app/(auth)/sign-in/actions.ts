"use server";

import { db } from "@/db/connection";
import { userTable } from "@/db/schema/user";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dummySignin = async () => {
  const [dummyUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, "JohnDoe@example.com"));

  if (!dummyUser) {
    const [user] = await db
      .insert(userTable)
      .values({
        name: "John Doe",
        email: "JohnDoe@example.com",
      })
      .returning({ userId: userTable.id });

    const token = await generateSessionToken();
    const session = await createSession(token, user.userId);

    await setSessionTokenCookie(token, session.expiresAt);

    redirect("/dashboard");
  }

  const token = await generateSessionToken();
  const session = await createSession(token, dummyUser.id);
  await setSessionTokenCookie(token, session.expiresAt);

  redirect("/dashboard");
};
