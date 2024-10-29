"use server";

import { db } from "@/db/connection";
import { mealFoodTable, mealTable } from "@/db/schema/food";
import { getCurrentUser } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddFoodSchema = z.object({
  mealId: z.string(),
  food: z.object({
    foodData: z.object({
      food: z.object({
        foodId: z.number(),
        description: z.string(),
        type: z.string().nullish(),
      }),
      nutrients: z
        .object({
          name: z.string(),
          unit: z.string(),
          amount: z.number(),
        })
        .array(),
      portions: z
        .object({
          id: z.string(),
          foodId: z.number(),
          servingSize: z.number(),
          servingSizeUnit: z.string(),
          householdServingFullText: z.string(),
        })
        .array(),
    }),
    foodPortionId: z.string().optional(),
    quantity: z.number(),
    servingSize: z.number(),
  }),
});

type AddFoodInput = z.infer<typeof AddFoodSchema>;

function calculateNewTotalCalories({
  food,
  mealTotals,
}: {
  food: AddFoodInput["food"];
  mealTotals: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
  };
}) {
  const { foodData, quantity, servingSize } = food;

  const addedNutrients = new Set<string>();

  foodData.nutrients.forEach((nutrient) => {
    const { name, amount } = nutrient;

    // Use startsWith to handle similar nutrient names
    if (!addedNutrients.has(name.toLowerCase())) {
      const totalAmount = amount * ((servingSize / 100) * quantity);

      if (name.toLowerCase().startsWith("energy")) {
        mealTotals.totalCalories += totalAmount;
      } else if (name.toLowerCase().startsWith("protein")) {
        mealTotals.totalProtein += totalAmount;
      } else if (name.toLowerCase().startsWith("carbohydrate")) {
        mealTotals.totalCarbs += totalAmount;
      } else if (name.toLowerCase().startsWith("total lipid (fat)")) {
        mealTotals.totalFats += totalAmount;
      }

      addedNutrients.add(name.toLowerCase());
    }
  });

  return {
    totalCalories: mealTotals.totalCalories,
    totalProtein: mealTotals.totalProtein,
    totalCarbs: mealTotals.totalCarbs,
    totalFats: mealTotals.totalFats,
  };
}

export const addFoodToMeal = async (data: AddFoodInput) => {
  const user = await getCurrentUser();

  if (!user) return { authorized: false };

  try {
    const [meal] = await db
      .select()
      .from(mealTable)
      .where(eq(mealTable.id, data.mealId));
    if (!meal) return { notFound: true };

    const mealTotals = {
      totalCalories: Number(meal.totalCalories),
      totalCarbs: Number(meal.totalCarbs),
      totalProtein: Number(meal.totalProtein),
      totalFats: Number(meal.totalFats),
    };
    const newTotals = calculateNewTotalCalories({
      food: data.food,
      mealTotals,
    });

    await db.transaction(async (tx) => {
      const [updatedMeal] = await tx
        .update(mealTable)
        .set({
          totalCalories: newTotals.totalCalories,
          totalProtein: newTotals.totalProtein,
          totalCarbs: newTotals.totalCarbs,
          totalFats: newTotals.totalFats,
        })
        .where(
          and(eq(mealTable.id, data.mealId), eq(mealTable.userId, user.id))
        )
        .returning({ mealId: mealTable.id });
      const addedFood = await tx.insert(mealFoodTable).values({
        foodId: data.food.foodData.food.foodId,
        mealId: updatedMeal.mealId,
        servingSize: data.food.servingSize,
        quantity: data.food.quantity,
        portionId: data.food.foodPortionId,
      });
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/dashboard/meals");

  return { success: true };
};

export const editMealName = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) return { unauthorized: true };

  const mealId = formData.get("id") as string;
  const name = formData.get("name") as string;

  const [updated] = await db
    .update(mealTable)
    .set({
      mealType: name,
    })
    .where(and(eq(mealTable.id, mealId), eq(mealTable.userId, user.id)))
    .returning({ mealId: mealTable.id });

  if (updated.mealId) {
    revalidatePath("/dashboard/meals");
    return { success: true };
  }

  return { success: false };
};

export const editMealTime = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) return { unauthorized: true };

  const mealId = formData.get("id") as string;
  const time = formData.get("time") as string;

  const [updated] = await db
    .update(mealTable)
    .set({
      mealTime: new Date(time),
    })
    .where(and(eq(mealTable.id, mealId), eq(mealTable.userId, user.id)))
    .returning({ mealId: mealTable.id });

  if (updated.mealId) {
    revalidatePath("/dashboard/meals");
    return { success: true };
  }

  return { success: false };
};

export const deleteMeal = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) return { unauthorized: true };

  const mealId = formData.get("id") as string;

  const [deleted] = await db
    .delete(mealTable)
    .where(and(eq(mealTable.id, mealId), eq(mealTable.userId, user.id)))
    .returning({ mealId: mealTable.id });

  if (deleted.mealId) {
    return { success: true };
  }

  return { success: false };
};
