"use client";

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMealDetails } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bolt,
  ChevronDown,
  ChevronUp,
  Clock,
  Ellipsis,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type MealDetailsResult = Awaited<ReturnType<typeof fetchMealDetails>>;
type MealDetail = NonNullable<MealDetailsResult>[number];

const MealLoggerDetails = ({
  loading,
  mealDetails,
  selectedDay,
  setSelectedDay,
}: {
  loading: boolean;
  mealDetails: MealDetailsResult;
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
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
              mealDetails?.map((mealDetail) => (
                <MealDetails
                  selectedDay={selectedDay}
                  key={mealDetail.meal.id}
                  mealDetail={mealDetail}
                  setSelectedDay={setSelectedDay}
                />
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
const MealDetails = ({
  mealDetail,
  selectedDay,
  setSelectedDay,
}: {
  mealDetail: MealDetail;
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const total =
    Number(mealDetail.meal.totalCarbs) +
    Number(mealDetail.meal.totalFats) +
    Number(mealDetail.meal.totalProtein);
  const carbsPercentage =
    (Number(mealDetail.meal.totalCarbs) / total) * 100 || 0;
  const fatsPercentage = (Number(mealDetail.meal.totalFats) / total) * 100 || 0;
  const proteinPercentage =
    (Number(mealDetail.meal.totalProtein) / total) * 100 || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <p>{mealDetail.meal.mealType}</p>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <p className="text-sm">
                {mealDetail.meal.mealTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Zap size={12} />
              <p className="text-sm">{mealDetail.meal.totalCalories} kcal</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>Add food</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Edit</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem key={"name"} value="name">
                      Name
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem key={"time"} value="time">
                      Time
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex flex-col gap-2 text-sm mb-2 flex-grow">
            <div className="grid grid-cols-3">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 bg-green-500 mr-1 rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                ></div>
                <span className="mr-1">Protein</span>
                <span className="font-semibold">
                  {mealDetail.meal.totalProtein}g
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                ></div>
                <span className="mr-1">Carbs</span>
                <span className="font-semibold">
                  {mealDetail.meal.totalCarbs}g
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 bg-red-500 mr-1 rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                ></div>
                <span className="mr-1">Fat</span>
                <span className="font-semibold">
                  {mealDetail.meal.totalFats}g
                </span>
              </div>
            </div>
            <div>
              <div
                className="flex h-2 rounded-full overflow-hidden"
                role="img"
                aria-label="Macronutrient proportions bar chart"
              >
                <div
                  style={{ width: `${proteinPercentage}%` }}
                  className="bg-green-500"
                  role="presentation"
                  aria-hidden="true"
                ></div>
                <div
                  style={{ width: `${carbsPercentage}%` }}
                  className="bg-yellow-500"
                  role="presentation"
                  aria-hidden="true"
                ></div>
                <div
                  style={{ width: `${fatsPercentage}%` }}
                  className="bg-red-500"
                  role="presentation"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="food-items"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isExpanded ? "Hide" : "Show"} food items
            </span>
          </Button>
        </div>
        {isExpanded && (
          <div id="food-items" className="space-y-2">
            {mealDetail.foods.map((food, index) => {
              const calories =
                (food.foodDetails.nutrients.find((nutrient) =>
                  nutrient.name.startsWith("Energy")
                )?.amount ?? 0) *
                ((food.quantity * food.servingSize) / 100);

              const protein =
                (food.foodDetails.nutrients.find((nutrient) =>
                  nutrient.name.startsWith("Protein")
                )?.amount ?? 0) *
                ((food.quantity * food.servingSize) / 100);

              const carbs =
                (food.foodDetails.nutrients.find((nutrient) =>
                  nutrient.name.startsWith("Carbohydrate")
                )?.amount ?? 0) *
                ((food.quantity * food.servingSize) / 100);

              const fats =
                (food.foodDetails.nutrients.find(
                  (nutrient) => nutrient.name === "Total lipid (fat)"
                )?.amount ?? 0) *
                ((food.quantity * food.servingSize) / 100);

              return (
                <div
                  key={index}
                  className="flex flex-col text-sm border-t py-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span>{food.foodDetails.food.description}</span>
                      <Separator orientation="vertical" className="h-6" />
                      <span>
                        {parseFloat(Number(food.quantity).toFixed(2))} x{" "}
                        {parseFloat(Number(food.servingSize).toFixed(2))}g
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>kcal</span>
                        <span>{calories.toFixed(2)}g</span>
                      </div>
                      <Progress
                        value={
                          ((calories || 0) /
                            Number(mealDetail.meal.totalCalories)) *
                          100
                        }
                        color="bg-primary"
                        className="h-1"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Protein</span>
                        <span>{protein.toFixed(2)}g</span>
                      </div>
                      <Progress
                        value={
                          (protein / Number(mealDetail.meal.totalProtein)) * 100
                        }
                        color="bg-green-500"
                        className="h-1"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Carbs</span>
                        <span>{carbs.toFixed(2)}g</span>
                      </div>
                      <Progress
                        value={
                          ((carbs || 0) / Number(mealDetail.meal.totalCarbs)) *
                          100
                        }
                        color="bg-yellow-500"
                        className="h-1"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Fats</span>
                        <span>{fats.toFixed(2)}g</span>
                      </div>
                      <Progress
                        value={
                          ((fats || 0) / Number(mealDetail.meal.totalFats)) *
                          100
                        }
                        color="bg-red-500"
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealLoggerDetails;
