"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { fetchMealDetails } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";

type MealDetailsResult = Awaited<ReturnType<typeof fetchMealDetails>>;
type MealDetail = NonNullable<MealDetailsResult>[number];

const MealLoggerDetails = ({ selectedDay }: { selectedDay: Date }) => {
  const [mealDetails, setMealDetails] = useState<MealDetailsResult>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async (selectedDay: Date) => {
      setLoading(true);
      const details = await fetchMealDetails(selectedDay);
      setMealDetails(details);
      setLoading(false);
    };
    fetch(selectedDay);
  }, [selectedDay]);

  return (
    <>
      <div className="flex w-full justify-center lg:hidden">
        <p>View Details</p>
      </div>
      <div className="flex flex-1 max-lg:hidden">
        <ScrollArea className="max-h-[412px] w-full">
          <div className="space-y-4 p-4 h-full">
            {loading ? (
              <div className="flex flex-grow items-center justify-center h-full w-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : mealDetails?.length ? (
              mealDetails?.map((meal) => (
                <MealDetails key={meal.id} meal={meal} />
              ))
            ) : (
              <div className="flex flex-grow items-center justify-center h-full w-full">
                <p className="text-2xl">Your meals will be displayed here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
const MealDetails = ({ meal }: { meal: MealDetail }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{meal.mealType}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {meal.mealTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-sm">Calories: {meal.totalCalories} kcal</div>
          <div className="text-sm">Protein: {meal.totalProtein}g</div>
          <div className="text-sm">Carbs: {meal.totalCarbs}g</div>
          <div className="text-sm">Fat: {meal.totalFats}g</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealLoggerDetails;
