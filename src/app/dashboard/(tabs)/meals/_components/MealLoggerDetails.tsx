"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMealDetails } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Ellipsis, Loader2 } from "lucide-react";
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerTrigger,
} from "@/components/ui/dialog-drawer";
import { Button } from "@/components/ui/button";

type MealDetailsResult = Awaited<ReturnType<typeof fetchMealDetails>>;
type MealDetail = NonNullable<MealDetailsResult>[number];

const MealLoggerDetails = ({
  loading,
  mealDetails,
}: {
  loading: boolean;
  mealDetails: MealDetailsResult;
}) => {
  return (
    <>
      <div className="flex flex-1">
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
          <div className="flex gap-2 items-center">
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
          <DialogDrawer>
            <DialogDrawerTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Ellipsis />
              </Button>
            </DialogDrawerTrigger>
            <DialogDrawerContent>
              <p>Edit</p>
            </DialogDrawerContent>
          </DialogDrawer>
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
