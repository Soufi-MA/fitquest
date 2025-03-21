"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { DrawerFooter } from "@/components/ui/drawer";
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

import { fetchFood } from "../../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NutrientsProportionsChart from "../AddMealElements/NutrientsProportionsChart";
import { addFoodToMeal } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import { getDateFromSearchParams } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

type FoodResult = Awaited<ReturnType<typeof fetchFood>>;
type FormData = {
  mealType: string;
  foodEntries: {
    foodData: FoodResult;
    foodPortionId: string | undefined;
    quantity: number;
    servingSize: number;
  }[];
  date: Date;
};

type SetFormData = React.Dispatch<React.SetStateAction<FormData>>;

const AddFoodDrawer = ({
  foodData,
  mealId,
  mealDate,
  setOpen,
  setIsExpanded,
  startTransition,
}: {
  foodData: FoodResult;
  mealId: string;
  mealDate: Date;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  startTransition: React.TransitionStartFunction;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const today = getDateFromSearchParams(date);
  const [optimisticDate, setOptimisticDate] = useOptimistic(today);

  const [servingSize, setServingSize] = useState<number>(100);
  const [foodPortionId, setFoodPortionId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { food, nutrients, portions } = foodData;

  const servingUnit =
    food.dataType === "Branded" ? portions[0].servingSizeUnit : "g";

  const handleSelect = (value: string) => {
    if (value === "1" || value === "100") {
      setServingSize(Number(value));
      setFoodPortionId(undefined);
    } else {
      setFoodPortionId(value);
      const portion = portions.find((portion) => portion.id === value);
      setServingSize(portion?.servingSize ?? 100);
    }
  };

  const handleAddFood = async () => {
    setAdding(true);
    const result = await addFoodToMeal({
      mealId,
      food: {
        quantity,
        servingSize,
        foodPortionId,
        foodData,
      },
    });

    if (result.success) {
      handleDateParams(mealDate);
      setOpen(false);
      setIsExpanded(true);
    }

    setOpen(false);
  };

  const handleDateParams = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    const dateString = date.toDateString();
    params.set("date", dateString);
    startTransition(() => {
      setOptimisticDate(date);
      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 px-4">
        <div className="flex flex-col gap-2 w-full min-w-0">
          <NutrientsProportionsChart
            calories={
              (nutrients.find((nutrient) => nutrient.name.startsWith("Energy"))
                ?.amount ?? 0) *
              ((quantity * servingSize) / 100)
            }
            carbs={
              (nutrients.find((nutrient) =>
                nutrient.name.startsWith("Carbohydrate")
              )?.amount ?? 0) *
              ((quantity * servingSize) / 100)
            }
            fats={
              (nutrients.find(
                (nutrient) => nutrient.name === "Total lipid (fat)"
              )?.amount ?? 0) *
              ((quantity * servingSize) / 100)
            }
            protein={
              (nutrients.find((nutrient) => nutrient.name.startsWith("Protein"))
                ?.amount ?? 0) *
              ((quantity * servingSize) / 100)
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label>Number of Servings</Label>
              <Input
                placeholder="Quantity"
                defaultValue={1}
                onChange={(e) =>
                  typeof Number(e.target.value) === "number"
                    ? setQuantity(Number(e.target.value))
                    : null
                }
              />
            </div>
            <Select defaultValue="100" onValueChange={handleSelect}>
              <div className="flex flex-col gap-1">
                <Label>Serving Size</Label>
                <SelectTrigger>
                  <SelectValue placeholder="Select a portion" />
                </SelectTrigger>
              </div>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Portion</SelectLabel>
                  <SelectItem value={"100"}>{"100 " + servingUnit}</SelectItem>
                  <SelectItem value={"1"}>{"1 " + servingUnit}</SelectItem>
                  {portions.map((portion) => (
                    <SelectItem key={portion.id} value={portion.id}>
                      {portion.householdServingFullText} ({portion.servingSize}{" "}
                      {servingUnit})
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
                {nutrients
                  .sort((a, b) => a.rank - b.rank)
                  .map((nutrient, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-secondary rounded-md p-2 text-sm"
                    >
                      <div className="font-semibold">{nutrient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(nutrient.amount * (quantity * servingSize)) / 100}{" "}
                        {nutrient.unit}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DrawerFooter>
        <Button onClick={() => handleAddFood()}>
          {adding ? (
            <span className="flex gap-2 items-center">
              <Loader2 className="animate-spin" />
              Adding...
            </span>
          ) : (
            "Add Food"
          )}
        </Button>
      </DrawerFooter>
    </div>
  );
};

export default AddFoodDrawer;
