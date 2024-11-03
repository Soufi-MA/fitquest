import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchFavoriteFoods,
  fetchInitialFoodSuggestions,
  fetchMealDetails,
  fetchRecentFoods,
} from "../actions";
import MealDetails from "./MealDetails";

const MealLoggerDetails = async ({
  mealDetailsPromise,
  favoriteFoodspromise,
  initialFoodSuggestionspromise,
  recentFoodspromise,
}: {
  mealDetailsPromise: ReturnType<typeof fetchMealDetails>;
  initialFoodSuggestionspromise: ReturnType<typeof fetchInitialFoodSuggestions>;
  recentFoodspromise: ReturnType<typeof fetchRecentFoods>;
  favoriteFoodspromise: ReturnType<typeof fetchFavoriteFoods>;
}) => {
  const mealDetails = await mealDetailsPromise;

  return (
    <>
      <div className="flex flex-1">
        <ScrollArea className="max-h-[412px] w-full">
          <div className="space-y-4 p-2 md:p-4 h-full">
            {mealDetails?.length ? (
              mealDetails
                ?.sort(
                  (a, b) =>
                    a.meal.mealTime.getTime() - b.meal.mealTime.getTime()
                )
                .map((mealDetail) => (
                  <MealDetails
                    key={mealDetail.meal.id}
                    mealDetail={mealDetail}
                    favoriteFoodspromise={favoriteFoodspromise}
                    initialFoodSuggestionspromise={
                      initialFoodSuggestionspromise
                    }
                    recentFoodspromise={recentFoodspromise}
                  />
                ))
            ) : (
              <div className="flex flex-grow items-center justify-center h-full w-full">
                <p className="text-2xl">
                  Start logging meals by clicking add meal button
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default MealLoggerDetails;
