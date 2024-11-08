"use client";

import React, { useState } from "react";
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

import { fetchFood } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NutrientsProportionsChart from "./AddMealElements/NutrientsProportionsChart";
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
  formData,
  setFormData,
  setOpen,
}: {
  foodData: FoodResult;
  formData: FormData;
  setFormData: SetFormData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [servingSize, setServingSize] = useState<number>(100);
  const [foodPortionId, setFoodPortionId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

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

  const handleAddFood = () => {
    setFormData({
      ...formData,
      foodEntries: [
        ...formData.foodEntries,
        { foodData, foodPortionId, quantity, servingSize },
      ],
    });
    setOpen(false);
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
        <Button onClick={() => handleAddFood()}>Add Food</Button>
      </DrawerFooter>
    </div>
  );
};

export default AddFoodDrawer;
