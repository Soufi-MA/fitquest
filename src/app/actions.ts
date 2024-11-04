"use server";

import { db } from "@/db/connection";
import { userTable } from "@/db/schema/user";
import { invalidateSession, validateSessionToken } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const nextCookies = await cookies();
  const token = nextCookies.get("session")?.value ?? null;
  if (!token) return { session: null, user: null };
  const result = await validateSessionToken(token);

  return result;
});

export const logout = async () => {
  const nextCookies = await cookies();
  const token = nextCookies.get("session")?.value ?? null;
  if (!token) redirect("/sign-in");
  const result = await validateSessionToken(token);

  if (result.session) {
    await invalidateSession(result.session.id);
  }

  nextCookies.delete("session");
  redirect("/sign-in");
};

export const getUserOnboardingStatus = async () => {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [foundUser] = await db
    .select({ onboardingStatus: userTable.onboardingStatus })
    .from(userTable)
    .where(eq(userTable.id, user.id));

  return foundUser.onboardingStatus;
};
