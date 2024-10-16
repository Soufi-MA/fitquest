"use server";

import { db } from "@/db/connection";
import {
  foodNutrientTable,
  foodPortionTable,
  foodTable,
  mealFoodTable,
  mealTable,
  nutrientTable,
} from "@/db/schema/food";
import { getCurrentUser } from "@/lib/session";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const fetchFoods = async (query: string) => {
  const foods = await db
    .select()
    .from(foodTable)
    .where(
      sql`to_tsvector('english', ${foodTable.description}) @@ plainto_tsquery('english', ${query})`
    )
    .limit(10);

  return foods;
};

export const fetchFood = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const [food] = await db
    .select({
      id: foodTable.id,
      description: foodTable.description,
      type: foodTable.dataType,
    })
    .from(foodTable)
    .where(eq(foodTable.id, id));
  const foodNutrients = await db
    .select()
    .from(foodNutrientTable)
    .where(eq(foodNutrientTable.foodId, food.id));
  const foodDetailedNutrients = await Promise.all(
    foodNutrients.map(async (nutrient) => {
      const [nutrientData] = await db
        .select()
        .from(nutrientTable)
        .where(eq(nutrientTable.id, nutrient.nutrientId));
      return {
        name: nutrientData.name,
        unit: nutrientData.unitName,
        amount: nutrient.amount,
      };
    })
  );
  const foodDetailedPortions = await db
    .select()
    .from(foodPortionTable)
    .where(eq(foodPortionTable.foodId, food.id));

  return {
    food: {
      foodId: food.id,
      description: food.description,
      type: food.type,
    },
    nutrients: foodDetailedNutrients,
    portions: foodDetailedPortions,
  };
};

const LogMealSchema = z.object({
  mealType: z.string(),
  foods: z
    .object({
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
    })
    .array(),
  mealTime: z.date(),
});

type LogMealInput = z.infer<typeof LogMealSchema>;

function calculateTotalNutrients(data: LogMealInput) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarb = 0;
  let totalFats = 0;

  data.foods.forEach((foodItem) => {
    const { foodData, quantity, servingSize } = foodItem;

    foodData.nutrients.forEach((nutrient) => {
      const { name, amount } = nutrient;

      const totalAmount =
        (amount / foodItem.servingSize) * (servingSize * quantity);

      switch (name.toLowerCase()) {
        case "energy":
          totalCalories += totalAmount;
          break;
        case "protein":
          totalProtein += totalAmount;
          break;
        case "carbohydrate, by difference":
          totalCarb += totalAmount;
          break;
        case "total lipid (fat)":
          totalFats += totalAmount;
          break;
      }
    });
  });

  return {
    totalCalories,
    totalProtein,
    totalCarb,
    totalFats,
  };
}
export const logMeal = async (data: LogMealInput) => {
  const user = await getCurrentUser();

  if (!user) return { authorized: false };
  try {
    const totals = calculateTotalNutrients(data);

    await db.transaction(async (tx) => {
      const [inserted] = await db
        .insert(mealTable)
        .values({
          userId: user.id,
          mealType: data.mealType,
          mealTime: data.mealTime,
          totalCalories: totals.totalCalories,
          totalCarbs: totals.totalCarb,
          totalFats: totals.totalFats,
          totalProtein: totals.totalProtein,
        })
        .returning({ mealId: mealTable.id });

      await db.insert(mealFoodTable).values(
        data.foods.map((food) => ({
          foodId: food.foodData.food.foodId,
          mealId: inserted.mealId,
          servingSize: food.servingSize,
          quantity: food.quantity,
          portionId: food.foodPortionId,
        }))
      );
    });
  } catch (error) {
    console.log(error);
  }

  return { success: true };
};

export const fetchMealDetails = async (date: Date) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const mealDetails = await db
    .select()
    .from(mealTable)
    .where(and(eq(mealTable.userId, user.id), eq(mealTable.mealTime, date)));

  return mealDetails;
};
