"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Ellipsis,
  Loader2,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { TimePicker12Demo } from "@/components/ui/time-picker/time-picker-12h-demo";
import AddFoodToMeal from "./EditMealElements/AddFoodToMeal";
import Form from "next/form";
import {
  deleteFoodEntry,
  deleteMeal,
  editFoodEntry,
  editMealName,
  editMealTime,
} from "./EditMealElements/actions";
import {
  fetchFavoriteFoods,
  fetchInitialFoodSuggestions,
  fetchMealDetails,
  fetchRecentFoods,
} from "../actions";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import NutrientsProportionsChart from "./AddMealElements/NutrientsProportionsChart";

type MealDetail = NonNullable<
  Awaited<ReturnType<typeof fetchMealDetails>>
>[number];

const MealDetails = ({
  mealDetail,
  favoriteFoodspromise,
  initialFoodSuggestionspromise,
  recentFoodspromise,
}: {
  mealDetail: MealDetail;
  initialFoodSuggestionspromise: ReturnType<typeof fetchInitialFoodSuggestions>;
  recentFoodspromise: ReturnType<typeof fetchRecentFoods>;
  favoriteFoodspromise: ReturnType<typeof fetchFavoriteFoods>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mealDialog, setMealDialog] = useState<string>("none");
  const [foodDialog, setFoodDialog] = useState<string>("none");
  const [dialogFood, setDialogFood] = useState<
    (typeof mealDetail.foods)[0] | null
  >(null);
  const [open, setOpen] = useState(false);
  const [foodEntryOpen, setfoodEntryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [timeInput, setTimeInput] = useState<Date>(mealDetail.meal.mealTime);
  const [servingSize, setServingSize] = useState<number>(100);
  const [foodPortionId, setFoodPortionId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const total =
    Number(mealDetail.meal.totalCarbs) +
    Number(mealDetail.meal.totalFats) +
    Number(mealDetail.meal.totalProtein);
  const carbsPercentage =
    (Number(mealDetail.meal.totalCarbs) / total) * 100 || 0;
  const fatsPercentage = (Number(mealDetail.meal.totalFats) / total) * 100 || 0;
  const proteinPercentage =
    (Number(mealDetail.meal.totalProtein) / total) * 100 || 0;

  const handleMealMenu = () => {
    switch (mealDialog) {
      case "add-food":
        return (
          <DialogContent
            id="dialogContainer"
            className="h-full max-h-[80vh] max-w-4xl overflow-hidden flex flex-col items-center justify-between"
          >
            <AddFoodToMeal
              mealId={mealDetail.meal.id}
              mealDate={mealDetail.meal.mealTime}
              setOpen={setOpen}
              setIsExpanded={setIsExpanded}
              startTransition={startTransition}
              favoriteFoodspromise={favoriteFoodspromise}
              initialFoodSuggestionspromise={initialFoodSuggestionspromise}
              recentFoodspromise={recentFoodspromise}
            />
          </DialogContent>
        );
      case "edit-name":
        const handleEditName = async (data: FormData) => {
          startTransition(async () => {
            const result = await editMealName(data);
            if (result.success === true) {
              setOpen(false);
            }
          });
        };

        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Meal</DialogTitle>
              <DialogDescription>
                Make changes to the meal name here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form action={(e) => handleEditName(e)}>
              <input
                value={mealDetail.meal.id}
                name="id"
                id="id"
                readOnly
                hidden
              />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meal-name" className="text-right">
                    Meal Name
                  </Label>
                  <Input
                    name="name"
                    id="name"
                    className="col-span-3"
                    defaultValue={mealDetail.meal.mealType}
                  />
                </div>
              </div>
              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        );
      case "edit-time":
        const handleEditTime = async (data: FormData) => {
          startTransition(async () => {
            const result = await editMealTime(data);
            if (result.success === true) {
              setOpen(false);
            }
          });
        };

        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Meal</DialogTitle>
              <DialogDescription>
                Make changes to the meal time here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form action={(e) => handleEditTime(e)}>
              <input
                value={mealDetail.meal.id}
                name="id"
                id="id"
                readOnly
                hidden
              />
              <input
                value={timeInput.toString()}
                name="time"
                id="time"
                readOnly
                hidden
              />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meal-name" className="text-right">
                    Meal Name
                  </Label>
                  <TimePicker12Demo
                    date={timeInput}
                    setDateAction={(date) => {
                      if (date) {
                        setTimeInput(date);
                      }
                    }}
                    className="col-span-3 justify-center"
                  />
                </div>
              </div>

              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        );

      case "delete-meal":
        const handleDeleteMeal = async (data: FormData) => {
          startTransition(async () => {
            const result = await deleteMeal(data);
            if (result.success === true) {
              setOpen(false);
            }
          });
        };

        return (
          <DialogContent>
            <DialogTitle>Delete {mealDetail.meal.mealType}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meal? This action cannot be
              undone.
            </DialogDescription>
            <Form action={(e) => handleDeleteMeal(e)}>
              <input
                value={mealDetail.meal.id}
                id="id"
                name="id"
                hidden
                readOnly
              />
              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={isPending}
                  className="flex gap-2"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        );

      default:
        return null;
    }
  };

  const handleFoodMenu = ({
    food,
  }: {
    food: (typeof mealDetail.foods)[0] | null;
  }) => {
    switch (foodDialog) {
      case "edit-food":
        if (!food) return null;
        const servingUnit =
          food.foodDetails.food.dataType === "Branded"
            ? food.foodDetails.portions[0].servingSizeUnit
            : "g";

        const handleSelect = (value: string) => {
          if (value === "1" || value === "100") {
            setServingSize(Number(value));
            setFoodPortionId(undefined);
          } else {
            setFoodPortionId(value);
            const portion = food.foodDetails.portions.find(
              (portion) => portion.id === value
            );
            setServingSize(portion?.servingSize ?? 100);
          }
        };

        const handleEditFoodEntry = async (data: FormData) => {
          startTransition(async () => {
            const result = await editFoodEntry(data);
            if (result.success === true) {
              setfoodEntryOpen(false);
            }
          });
        };
        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Food Entry</DialogTitle>
              <DialogDescription>
                Make changes to the food entry here. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <Form
              action={(e) => handleEditFoodEntry(e)}
              className="flex flex-col gap-4"
            >
              <input id="id" name="id" value={food.id} hidden readOnly />
              <div className="flex flex-col justify-between items-center gap-4 px-4">
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <NutrientsProportionsChart
                    calories={
                      (food.foodDetails.nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Energy")
                      )?.amount ?? 0) *
                      ((quantity * servingSize) / 100)
                    }
                    carbs={
                      (food.foodDetails.nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Carbohydrate")
                      )?.amount ?? 0) *
                      ((quantity * servingSize) / 100)
                    }
                    fats={
                      (food.foodDetails.nutrients.find(
                        (nutrient) => nutrient.name === "Total lipid (fat)"
                      )?.amount ?? 0) *
                      ((quantity * servingSize) / 100)
                    }
                    protein={
                      (food.foodDetails.nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Protein")
                      )?.amount ?? 0) *
                      ((quantity * servingSize) / 100)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Quantity"
                      id="quantity"
                      name="quantity"
                      defaultValue={quantity}
                      onChange={(e) =>
                        typeof Number(e.target.value) === "number"
                          ? setQuantity(Number(e.target.value))
                          : null
                      }
                    />
                    <input
                      id="portionId"
                      name="portionId"
                      value={foodPortionId ?? ""}
                      hidden
                      readOnly
                    />
                    <input
                      id="servingSize"
                      name="servingSize"
                      value={servingSize}
                      hidden
                      readOnly
                    />
                    <Select
                      defaultValue={
                        ["100", "1"].includes(food.servingSize.toString())
                          ? food.servingSize.toString()
                          : food.foodPortionId
                          ? food.foodPortionId
                          : "100"
                      }
                      onValueChange={handleSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a portion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Portion</SelectLabel>
                          <SelectItem value={"100"}>
                            {"100 " + servingUnit}
                          </SelectItem>
                          <SelectItem value={"1"}>
                            {"1 " + servingUnit}
                          </SelectItem>
                          {food.foodDetails.portions.map((portion) => (
                            <SelectItem key={portion.id} value={portion.id}>
                              {portion.householdServingFullText} (
                              {portion.servingSize} {servingUnit})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>View All Nutrients</AccordionTrigger>
                  <AccordionContent className="max-h-[200px] overflow-y-scroll">
                    <div className="h-[300px]">
                      <ul className="space-y-2">
                        {food.foodDetails.nutrients
                          .sort((a, b) => a.rank - b.rank)
                          .map((nutrient, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-secondary rounded-md p-2 text-sm"
                            >
                              <div className="font-semibold">
                                {nutrient.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {(
                                  (nutrient.amount * (quantity * servingSize)) /
                                  100
                                ).toFixed(2)}{" "}
                                {nutrient.unit}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        );
      case "delete-food":
        if (!food) return null;
        const handleDeleteEntry = async (data: FormData) => {
          startTransition(async () => {
            const result = await deleteFoodEntry(data);
            if (result.success === true) {
              setfoodEntryOpen(false);
            }
          });
        };

        return (
          <DialogContent>
            <DialogTitle>
              Delete {food.foodDetails.food.description}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this food entry? This action
              cannot be undone.
            </DialogDescription>
            <Form action={(e) => handleDeleteEntry(e)}>
              <input value={food.id} id="id" name="id" hidden readOnly />
              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={isPending}
                  className="flex gap-2"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn("w-full max-w-2xl mx-auto", {
        "animate-pulse": isPending,
      })}
    >
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
          <Dialog open={open} onOpenChange={setOpen}>
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
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={() => {
                      setMealDialog("add-food");
                      setOpen(true);
                    }}
                  >
                    Add food
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Edit</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup>
                      <DialogTrigger asChild>
                        <DropdownMenuRadioItem
                          onSelect={() => setMealDialog("edit-name")}
                          key={"name"}
                          value="name"
                        >
                          Name
                        </DropdownMenuRadioItem>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <DropdownMenuRadioItem
                          onSelect={() => setMealDialog("edit-time")}
                          key={"time"}
                          value="time"
                        >
                          Time
                        </DropdownMenuRadioItem>
                      </DialogTrigger>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={() => setMealDialog("delete-meal")}
                  >
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            {handleMealMenu()}
          </Dialog>
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
                <span className="mr-1 hidden md:block">Protein</span>
                <span className="mr-1 md:hidden">P</span>
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
                <span className="mr-1 hidden md:block">Carbs</span>
                <span className="mr-1 md:hidden">C</span>
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
                <span className="mr-1 hidden md:block">Fat</span>
                <span className="mr-1 md:hidden">F</span>
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
                    <Dialog
                      open={foodEntryOpen}
                      onOpenChange={setfoodEntryOpen}
                    >
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
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={() => {
                                setfoodEntryOpen(true);
                                setDialogFood(food);
                                setQuantity(
                                  parseFloat(food.quantity.toString())
                                );
                                setServingSize(food.servingSize);
                                setFoodPortionId(
                                  food.foodPortionId ?? undefined
                                );
                                setFoodDialog("edit-food");
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={() => {
                                setfoodEntryOpen(true);
                                setDialogFood(food);
                                setFoodDialog("delete-food");
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {handleFoodMenu({ food: dialogFood })}
                    </Dialog>
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

export default MealDetails;
