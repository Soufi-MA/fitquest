"use server";

import { getCurrentUser } from "@/app/actions";
import { db } from "@/db/connection";
import { goalTable, preferenceTable, userTable } from "@/db/schema/user";
import {
  OnboadingStep1,
  OnboadingStep2,
  OnboadingStep3,
} from "@/lib/validators/userValidators";
import { eq, sql } from "drizzle-orm";

export const submitOnboadingStep1 = async (data: OnboadingStep1) => {
  const { user } = await getCurrentUser();
  if (!user) return { unauthorized: true };

  const [updatedUser] = await db
    .update(userTable)
    .set({
      name: data.name,
      gender: data.gender,
      birthDay: data.birthDay,
      onboardingStatus: "METRICS_INCOMPLETE",
    })
    .where(eq(userTable.id, user.id))
    .returning({ id: userTable.id });

  if (updatedUser.id) {
    return "ok";
  }
};

export const submitOnboadingStep2 = async (data: OnboadingStep2) => {
  const { user } = await getCurrentUser();
  if (!user) return { unauthorized: true };

  let updated;
  await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(userTable)
      .set({
        height: data.height,
        weight: data.weight,
        onboardingStatus: "GOAL_INCOMPLETE",
      })
      .where(eq(userTable.id, user.id))
      .returning({ id: userTable.id });

    const [updatedPreferences] = await tx
      .insert(preferenceTable)
      .values({
        userId: updatedUser.id,
        lengthUnit: data.lengthUnit,
        weightUnit: data.weightUnit,
      })
      .returning({ id: preferenceTable.id })
      .onConflictDoUpdate({
        target: preferenceTable.userId,
        set: { lengthUnit: data.lengthUnit, weightUnit: data.weightUnit },
      });

    if (updatedUser.id && updatedPreferences.id) {
      updated = true;
    }
  });

  if (updated) {
    return "ok";
  }
};

export const submitOnboadingStep3 = async (data: OnboadingStep3) => {
  const { user } = await getCurrentUser();
  if (!user) return { unauthorized: true };

  let inserted;
  await db.transaction(async (tx) => {
    if (!user.weight) return { missingWeight: true };
    const [insertedGoal] = await tx
      .insert(goalTable)
      .values({
        userId: user.id,
        goalType: data.goalType,
        goalRate: data.goalRate,
        startingWeight: user.weight,
        startDate: new Date(),
        goalWeight: data.goalWeight,
      })
      .returning({ id: goalTable.id })
      .onConflictDoUpdate({
        target: [goalTable.status, goalTable.userId],
        targetWhere: sql`${goalTable.status} = 'IN_PROGRESS'`,
        set: {
          goalType: data.goalType,
          goalRate: data.goalRate,
          startingWeight: user.weight,
          startDate: new Date(),
          goalWeight: data.goalWeight,
        },
      });

    const [updatedUser] = await tx
      .update(userTable)
      .set({
        onboardingStatus: "COMPLETED",
      })
      .returning({ id: userTable.id });

    if (insertedGoal.id && updatedUser.id) {
      inserted = true;
    }
  });

  if (inserted) {
    return "ok";
  }
};
