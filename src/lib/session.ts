"use server";

import { lucia, validateRequest } from "./auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { generateId, User } from "lucia";

export const getCurrentUser = cache(async () => {
  const nextCookies = await cookies();
  const sessionId = nextCookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      nextCookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      nextCookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return user;
});

export async function setSession(id: User["id"]) {
  const nextCookies = await cookies();

  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  nextCookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  nextCookies.delete("name");
  nextCookies.delete("guestSessionId");
}

export async function logout() {
  "use server";
  const nextCookies = await cookies();

  const { session } = await validateRequest();
  if (!session) return;

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  nextCookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/sign-in");
}
