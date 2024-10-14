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
import { fetchFood } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    food.type === "Branded" ? portions[0].servingSizeUnit : "g";

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
    <>
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Nutrient</h2>
          {nutrients
            .filter((nutrient) =>
              [
                "Protein",
                "Total lipid (fat)",
                "Carbohydrate, by difference",
                "Energy",
              ].includes(nutrient.name)
            )
            .map((nutrient) => (
              <p key={nutrient.name}>
                {nutrient.name}:{" "}
                {(nutrient.amount * ((quantity * servingSize) / 100)).toFixed(
                  2
                )}{" "}
                {nutrient.unit}
              </p>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Portions</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Quantity"
              defaultValue={1}
              onChange={(e) =>
                typeof Number(e.target.value) === "number"
                  ? setQuantity(Number(e.target.value))
                  : null
              }
            />
            <Select defaultValue="100" onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a portion" />
              </SelectTrigger>
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
      <DrawerFooter>
        <Button onClick={() => handleAddFood()}>Add Food</Button>
      </DrawerFooter>
    </>
  );
};

export default AddFoodDrawer;
