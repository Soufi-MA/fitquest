import React, { cache } from "react";
import { Separator } from "@/components/ui/separator";

import MealLoggerHeader from "./MealLoggerHeader";
import MealLoggerSummary from "./MealLoggerSummary";
import MealLoggerDetails from "./MealLoggerDetails";
import { getDateFromSearchParams } from "@/lib/utils";
import { fetchMealDetails, fetchUserGoal } from "../actions";

const MealLogger = async ({ date }: { date: string | undefined }) => {
  const today = getDateFromSearchParams(date);
  const getChchedMealDetails = cache(fetchMealDetails);
  const mealDetailsPromise = getChchedMealDetails(today);
  const getCachedUserGoal = cache(fetchUserGoal);
  const userGoalPromise = getCachedUserGoal();

  return (
    <div className="col-span-full flex flex-col rounded-md bg-muted/60 backdrop-blur-md border">
      <MealLoggerHeader />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full flex-col lg:flex-row lg:h-[412px] overflow-hidden peer-data-[pending=true]:animate-pulse">
        <MealLoggerSummary
          mealDetailsPromise={mealDetailsPromise}
          userGoalPromise={userGoalPromise}
        />
        <MealLoggerDetails mealDetailsPromise={mealDetailsPromise} />
      </div>
    </div>
  );
};

export default MealLogger;
