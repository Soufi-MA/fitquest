"use server";

import { db } from "@/db/connection";
import { userTable } from "@/db/schema/user";
import { setSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { redirect } from "next/navigation";

export const dummySignin = async () => {
  const [dummyUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, "JohnDoe@example.com"));

  if (!dummyUser) {
    const id = generateId(15);
    await db.insert(userTable).values({
      id,
      name: "John Doe",
      email: "JohnDoe@example.com",
      emailVerified: new Date(),
      birthDay: new Date("2000-01-01"),
      gender: "MALE",
      height: 180,
      weight: 80,
      plan: "FREE",
    });
    setSession(id);
    redirect("/dashboard");
  }

  setSession(dummyUser.id);

  redirect("/dashboard");
};
