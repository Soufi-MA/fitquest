import React from "react";
import { RadialProgressChart } from "@/components/charts/RadialProgressChart";
import { Progress } from "@/components/ui/progress";
import { fetchMealDetails, fetchUserGoal } from "../actions";
import { cn } from "@/lib/utils";
import { Target, Utensils } from "lucide-react";

const MealLoggerSummary = async ({
  mealDetailsPromise,
  userGoalPromise,
}: {
  mealDetailsPromise: ReturnType<typeof fetchMealDetails>;
  userGoalPromise: ReturnType<typeof fetchUserGoal>;
}) => {
  const mealDetails = await mealDetailsPromise;
  const userGoal = await userGoalPromise;
  if (!userGoal) return;

  const totalCalories =
    mealDetails?.reduce((acc, curr) => {
      return acc + Number(curr.meal.totalCalories);
    }, 0) ?? 0;
  const totalFats =
    mealDetails?.reduce((acc, curr) => {
      return acc + Number(curr.meal.totalFats);
    }, 0) ?? 0;
  const totalProtein =
    mealDetails?.reduce((acc, curr) => {
      return acc + Number(curr.meal.totalProtein);
    }, 0) ?? 0;
  const totalCarbs =
    mealDetails?.reduce((acc, curr) => {
      return acc + Number(curr.meal.totalCarbs);
    }, 0) ?? 0;

  const dailyCalories = userGoal.nutrition.dailyCalories;
  const dailyProtein = userGoal.nutrition.macroGrams.protein;
  const dailyFats = userGoal.nutrition.macroGrams.fats;
  const dailyCarbs = userGoal.nutrition.macroGrams.carbs;

  const calorieProgress = (totalCalories / dailyCalories) * 100;
  const isOverCalories = totalCalories > dailyCalories;

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-2 border-r px-4 py-4">
      <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
        <div className="flex justify-center items-center min-w-0">
          <RadialProgressChart
            label="Calories Remaining"
            data={[
              {
                name: "calories",
                progress: calorieProgress,
                value: totalCalories,
                fill: "hsl(var(--chart-1))",
              },
            ]}
            current={dailyCalories}
          />
        </div>
        <div className="flex-[2] max-w-[250px] flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col gap-1 w-full">
            <h2>Protien</h2>
            <Progress
              color="bg-green-500"
              value={
                (totalProtein / dailyProtein) * 100 > 100
                  ? 100
                  : (totalProtein / dailyProtein) * 100
              }
            />
            <p>
              {totalProtein.toFixed(2)}/{dailyProtein}g
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h2>Carbs</h2>
            <Progress
              color="bg-yellow-500"
              value={
                (totalCarbs / dailyCarbs) * 100 > 100
                  ? 100
                  : (totalCarbs / dailyCarbs) * 100
              }
            />
            <p>
              {totalCarbs.toFixed(2)}/{dailyCarbs}g
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h2>Fats</h2>
            <Progress
              color="bg-red-500"
              value={
                (totalFats / dailyFats) * 100 > 100
                  ? 100
                  : (totalFats / dailyFats) * 100
              }
            />
            <p>
              {totalFats.toFixed(2)}/{dailyFats}g
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-around">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Daily Goal</p>
            <p className="font-semibold">
              {dailyCalories.toLocaleString()} kcal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Consumed</p>
            <p
              className={cn(
                "font-semibold",
                isOverCalories && "text-destructive"
              )}
            >
              {totalCalories.toLocaleString()} kcal
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-center text-muted-foreground">
        {isOverCalories &&
          `${(
            totalCalories - dailyCalories
          ).toLocaleString()} kcal over target`}
      </p>
    </div>
  );
};

export default MealLoggerSummary;
