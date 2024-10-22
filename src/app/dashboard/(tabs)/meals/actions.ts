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
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

export const fetchFoods = async (query: string) => {
  const foods = await db
    .select()
    .from(foodTable)
    .where(
      sql`to_tsvector('english', ${foodTable.description}) @@ plainto_tsquery('english', ${query})`
    )
    .orderBy(
      sql`
      CASE 
        WHEN ${foodTable.dataType} = 'Foundation' THEN 0
        WHEN ${foodTable.dataType} = 'Survey (FNDDS)' THEN 1
        WHEN ${foodTable.dataType} = 'Branded' THEN 2
        ELSE 3
      END
    `,
      foodTable.dataType
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
        rank: nutrientData.rank,
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

    const addedNutrients = new Set<string>();

    foodData.nutrients.forEach((nutrient) => {
      const { name, amount } = nutrient;

      // Use startsWith to handle similar nutrient names
      if (!addedNutrients.has(name.toLowerCase())) {
        const totalAmount = amount * ((servingSize / 100) * quantity);

        if (name.toLowerCase().startsWith("energy")) {
          totalCalories += totalAmount;
        } else if (name.toLowerCase().startsWith("protein")) {
          totalProtein += totalAmount;
        } else if (name.toLowerCase().startsWith("carbohydrate")) {
          totalCarb += totalAmount;
        } else if (name.toLowerCase().startsWith("total lipid (fat)")) {
          totalFats += totalAmount;
        }

        addedNutrients.add(name.toLowerCase());
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

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const mealDetails = await db
    .select()
    .from(mealTable)
    .where(
      and(
        eq(mealTable.userId, user.id),
        gte(mealTable.mealTime, startOfDay),
        lte(mealTable.mealTime, endOfDay)
      )
    );

  const fullMealDetails = await Promise.all(
    mealDetails.map(async (meal) => {
      const mealFoods = await db
        .select({
          foodId: mealFoodTable.foodId,
          quantity: mealFoodTable.quantity,
          servingSize: mealFoodTable.servingSize,
        })
        .from(mealFoodTable)
        .where(eq(mealFoodTable.mealId, meal.id));
      const fullFoodDetails = await Promise.all(
        mealFoods.map(async (food) => {
          const foodDetails = await fetchFood(food.foodId);
          return {
            foodDetails,
            quantity: food.quantity,
            servingSize: food.servingSize,
          };
        })
      );

      return {
        meal,
        foods: fullFoodDetails,
      };
    })
  );

  return fullMealDetails;
};

export const fetchFoodEntries = async (mealId: string) => {
  const user = await getCurrentUser();
  if (!user) return [];

  const [meal] = await db
    .select()
    .from(mealTable)
    .where(and(eq(mealTable.userId, user.id), eq(mealTable.id, mealId)));
  if (!meal) return [];

  const mealFoods = await db
    .select()
    .from(mealFoodTable)
    .where(eq(mealFoodTable.mealId, mealId));

  const foodEntries = await Promise.all(
    mealFoods.map(async (food) => {
      const foodData = await fetchFood(food.foodId);
      return {
        foodData,
        foodPortionId: food.portionId ?? undefined,
        quantity: food.quantity,
        servingSize: food.servingSize,
      };
    })
  );
  return foodEntries;
};
