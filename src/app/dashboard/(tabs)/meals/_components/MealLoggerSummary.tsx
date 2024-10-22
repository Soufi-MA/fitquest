"use client";
import React from "react";
import { RadialProgressChart } from "@/components/charts/RadialProgressChart";
import { Progress } from "@/components/ui/progress";
import { fetchMealDetails } from "../actions";

type MealDetailsResult = Awaited<ReturnType<typeof fetchMealDetails>>;
const MealLoggerSummary = ({
  mealDetails,
}: {
  mealDetails: MealDetailsResult;
}) => {
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

  return (
    <div className="flex flex-1 items-center justify-center gap-4 sm:gap-8 border-r px-4 py-4">
      <div className="flex justify-center items-center min-w-0">
        <RadialProgressChart
          label="Calories consumed"
          data={[
            {
              name: "calories",
              progress: (totalCalories / 2000) * 100,
              value: totalCalories,
              fill: "hsl(var(--chart-1))",
            },
          ]}
        />
      </div>
      <div className="flex-[2] max-w-[250px] flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col gap-1 w-full">
          <h2>Protien</h2>
          <Progress
            color="bg-green-500"
            value={
              (totalProtein / 60) * 100 > 100 ? 100 : (totalProtein / 60) * 100
            }
          />
          <p>{totalProtein.toFixed(2)}/60g</p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h2>Carbs</h2>
          <Progress
            color="bg-yellow-500"
            value={
              (totalCarbs / 60) * 100 > 100 ? 100 : (totalCarbs / 60) * 100
            }
          />
          <p>{totalCarbs.toFixed(2)}/60g</p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h2>Fats</h2>
          <Progress
            color="bg-red-500"
            value={(totalFats / 60) * 100 > 100 ? 100 : (totalFats / 60) * 100}
          />
          <p>{totalFats.toFixed(2)}/20g</p>
        </div>
      </div>
    </div>
  );
};

export default MealLoggerSummary;
