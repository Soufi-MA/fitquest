"use server";

import { db } from "@/db/connection";
import { preferenceTable, userTable } from "@/db/schema/user";
import { getCurrentUser } from "@/lib/session";
import { TUpdateUserValidator } from "@/lib/validators/userValidators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUserPreference = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const [preference] = await db
    .select()
    .from(preferenceTable)
    .where(eq(preferenceTable.userId, user.id))
    .limit(1);

  return preference;
};

export const updateUser = async (data: TUpdateUserValidator) => {
  const user = await getCurrentUser();
  if (!user) return "not found";

  let updated = false;
  await db.transaction(async (tx) => {
    await tx
      .update(userTable)
      .set({
        birthDay: data.birthDay,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        name: data.name,
      })
      .returning({ updatedUserId: userTable.id });

    await tx
      .insert(preferenceTable)
      .values({
        lengthUnit: data.heightUnit,
        weightUnit: data.weightUnit,
        userId: user.id,
      })
      .onConflictDoUpdate({
        target: preferenceTable.userId,
        set: { lengthUnit: data.heightUnit, weightUnit: data.weightUnit },
      });

    updated = true;
  });
  if (updated) {
    revalidatePath("/dashboard/profile");
    return "ok";
  }
};
