"use server";

import { db } from "@/db/connection";
import {
  foodNutrientTable,
  foodPortionTable,
  foodTable,
  nutrientTable,
} from "@/db/schema/food";
import { getCurrentUser } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
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
  foods: z.array(
    z.object({
      foodId: z.number(),
      foodPortionId: z.string().optional(),
      quantity: z.number(),
      servingSize: z.number(),
    })
  ),
  selectedDay: z.date(),
});

type LogMealInput = z.infer<typeof LogMealSchema>;

export const logMeal = async (data: LogMealInput) => {
  const user = getCurrentUser();
  console.log(data);
};
