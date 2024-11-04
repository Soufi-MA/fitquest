"use server";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "@/db/connection";
import {
  ActivityLevelType,
  GenderType,
  sessionTable,
  userTable,
} from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(sessionTable).values({
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  });
  return session;
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [dbSession] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId));
  const [dbUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, dbSession.userId));

  if (dbSession === null || dbUser === null) {
    return { session: null, user: null };
  }

  const session: Session = {
    id: dbSession.id,
    userId: dbSession.userId,
    expiresAt: dbSession.expiresAt,
  };
  const user: User = {
    ...dbUser,
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db.update(sessionTable).set({
      id: session.id,
      expiresAt: session.expiresAt,
    });
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type User = {
  id: number;
  name: string | null;
  gender: GenderType | null;
  profilePicture: string | null;
  birthDay: Date | null;
  height: number | null;
  weight: number | null;
  activityLevel: ActivityLevelType | null;
  plan: string | null;
};
