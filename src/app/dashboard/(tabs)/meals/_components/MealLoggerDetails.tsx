import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMealDetails } from "../actions";
import MealDetails from "./MealDetails";

const MealLoggerDetails = async ({
  mealDetailsPromise,
}: {
  mealDetailsPromise: ReturnType<typeof fetchMealDetails>;
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
