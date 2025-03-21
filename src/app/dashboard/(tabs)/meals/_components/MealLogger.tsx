import React from "react";
import { Separator } from "@/components/ui/separator";

import MealLoggerHeader from "./MealLoggerHeader";
import MealLoggerSummary from "./MealLoggerSummary";
import MealLoggerDetails from "./MealLoggerDetails";
import {
  fetchFavoriteFoods,
  fetchInitialFoodSuggestions,
  fetchMealDetails,
  fetchRecentFoods,
  fetchUserGoal,
} from "../actions";

const MealLogger = async ({
  mealDetailsPromise,
  userGoalPromise,
  initialFoodSuggestionspromise,
  favoriteFoodspromise,
  recentFoodspromise,
}: {
  mealDetailsPromise: ReturnType<typeof fetchMealDetails>;
  userGoalPromise: ReturnType<typeof fetchUserGoal>;
  initialFoodSuggestionspromise: ReturnType<typeof fetchInitialFoodSuggestions>;
  favoriteFoodspromise: ReturnType<typeof fetchFavoriteFoods>;
  recentFoodspromise: ReturnType<typeof fetchRecentFoods>;
}) => {
  return (
    <div className="col-span-full flex flex-col rounded-md bg-muted/60 backdrop-blur-md border">
      <MealLoggerHeader
        initialFoodSuggestionspromise={initialFoodSuggestionspromise}
        favoriteFoodspromise={favoriteFoodspromise}
        recentFoodspromise={recentFoodspromise}
      />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full flex-col lg:flex-row lg:h-[412px] overflow-hidden peer-data-[pending=true]:animate-pulse">
        <MealLoggerSummary
          mealDetailsPromise={mealDetailsPromise}
          userGoalPromise={userGoalPromise}
        />
        <MealLoggerDetails
          mealDetailsPromise={mealDetailsPromise}
          initialFoodSuggestionspromise={initialFoodSuggestionspromise}
          favoriteFoodspromise={favoriteFoodspromise}
          recentFoodspromise={recentFoodspromise}
        />
      </div>
    </div>
  );
};

export default MealLogger;
