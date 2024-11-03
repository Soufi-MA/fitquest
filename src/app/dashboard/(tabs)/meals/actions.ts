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
import {
  ActivityLevel,
  GoalRate,
  goalTable,
  userTable,
} from "@/db/schema/user";
import { getCurrentUser } from "@/lib/session";
import { calculateAge } from "@/lib/utils";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
      id: food.id,
      description: food.description,
      dataType: food.type,
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
          id: z.number(),
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
      const [inserted] = await tx
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
      await tx.insert(mealFoodTable).values(
        data.foods.map((food) => ({
          foodId: food.foodData.food.id,
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

  revalidatePath("/dashboard/meals");

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
          id: mealFoodTable.id,
          foodId: mealFoodTable.foodId,
          quantity: mealFoodTable.quantity,
          servingSize: mealFoodTable.servingSize,
          portionId: mealFoodTable.portionId,
        })
        .from(mealFoodTable)
        .where(eq(mealFoodTable.mealId, meal.id));
      const fullFoodDetails = await Promise.all(
        mealFoods.map(async (food) => {
          const foodDetails = await fetchFood(food.foodId);
          return {
            id: food.id,
            foodDetails,
            quantity: food.quantity,
            servingSize: food.servingSize,
            foodPortionId: food.portionId,
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
export const fetchUserGoal = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const [currentUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, user.id));

  const [userGoal] = await db
    .select()
    .from(goalTable)
    .where(
      and(eq(goalTable.userId, user.id), eq(goalTable.status, "IN_PROGRESS"))
    );

  if (!currentUser.weight) return null;

  // Calculate BMR using Mifflin-St Jeor Equation
  const age = calculateAge(currentUser.birthDay);

  const bmr =
    10 * currentUser.weight +
    6.25 * currentUser.height -
    5 * age +
    (currentUser.gender === "MALE" ? 5 : -161);

  // Calculate TDEE using activity level multiplier
  const tdee = Math.round(
    bmr * ActivityLevel[currentUser.activityLevel].multiplier
  );

  let dailyCalories: number;
  let macroRatios: {
    protein: number;
    carbs: number;
    fats: number;
  };

  const goalRateInfo = GoalRate[userGoal ? userGoal.goalRate : "MODERATE"];

  switch (userGoal?.goalType) {
    case "WEIGHT_LOSS":
      dailyCalories = Math.round(tdee - goalRateInfo.calorieAdjustment.deficit);
      macroRatios = {
        protein: 0.4, // Higher protein for muscle preservation during deficit
        carbs: 0.35,
        fats: 0.25,
      };
      break;

    case "MUSCLE_GAIN":
      dailyCalories = Math.round(tdee + goalRateInfo.calorieAdjustment.surplus);
      macroRatios = {
        protein: 0.3,
        carbs: 0.45, // Higher carbs for muscle glycogen and recovery
        fats: 0.25,
      };
      break;

    case "WEIGHT_MAINTENANCE":
      dailyCalories = tdee;
      macroRatios = {
        protein: 0.3,
        carbs: 0.4,
        fats: 0.3,
      };
      break;

    default:
      dailyCalories = tdee;
      macroRatios = {
        protein: 0.3,
        carbs: 0.4,
        fats: 0.3,
      };
      break;
  }

  // Calculate macro grams
  const macroGrams = {
    protein: Math.round((dailyCalories * macroRatios.protein) / 4), // 4 calories per gram
    carbs: Math.round((dailyCalories * macroRatios.carbs) / 4), // 4 calories per gram
    fats: Math.round((dailyCalories * macroRatios.fats) / 9), // 9 calories per gram
  };

  // Calculate projected weekly change
  const weeklyChange = userGoal
    ? userGoal.goalType === "WEIGHT_LOSS"
      ? goalRateInfo.weightLossPerWeek
      : userGoal.goalType === "MUSCLE_GAIN"
      ? goalRateInfo.weightGainPerWeek
      : 0
    : 0;

  return {
    goal: userGoal,
    nutrition: {
      tdee,
      dailyCalories,
      macroRatios,
      macroGrams,
      calorieAdjustment: userGoal
        ? userGoal?.goalType === "WEIGHT_MAINTENANCE"
          ? 0
          : userGoal?.goalType === "WEIGHT_LOSS"
          ? -goalRateInfo.calorieAdjustment.deficit
          : goalRateInfo.calorieAdjustment.surplus
        : 0,
    },
    projectedChanges: weeklyChange
      ? {
          weeklyChange,
          estimatedDuration:
            weeklyChange.kg > 0
              ? Math.round(
                  Math.abs(currentUser.weight - userGoal.goalWeight!) /
                    weeklyChange.kg
                )
              : null,
        }
      : null,
  };
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
        id: food.id,
        foodData,
        foodPortionId: food.portionId ?? undefined,
        quantity: food.quantity,
        servingSize: food.servingSize,
      };
    })
  );
  return foodEntries;
};
