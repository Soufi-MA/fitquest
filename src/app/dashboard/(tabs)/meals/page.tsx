import React, { cache } from "react";
import MealLogger from "./_components/MealLogger";
import {
  fetchFavoriteFoods,
  fetchInitialFoodSuggestions,
  fetchMealDetails,
  fetchRecentFoods,
  fetchUserGoal,
} from "./actions";
import { getDateFromSearchParams } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const { date } = await searchParams;
  const today = getDateFromSearchParams(date);

  const getChchedMealDetails = cache(fetchMealDetails);
  const mealDetailsPromise = getChchedMealDetails(today);
  const getCachedUserGoal = cache(fetchUserGoal);
  const userGoalPromise = getCachedUserGoal();

  const getCachedInitialFoodSuggestions = cache(fetchInitialFoodSuggestions);
  const initialFoodSuggestionspromise = getCachedInitialFoodSuggestions();

  const getCachedFavoriteFoods = cache(fetchFavoriteFoods);
  const favoriteFoodspromise = getCachedFavoriteFoods();

  const getCachedRecentFoods = cache(fetchRecentFoods);
  const recentFoodspromise = getCachedRecentFoods();

  return (
    <div className="px-2 py-2 md:px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <MealLogger
          mealDetailsPromise={mealDetailsPromise}
          userGoalPromise={userGoalPromise}
          initialFoodSuggestionspromise={initialFoodSuggestionspromise}
          favoriteFoodspromise={favoriteFoodspromise}
          recentFoodspromise={recentFoodspromise}
        />
      </div>
    </div>
  );
};

export default page;
