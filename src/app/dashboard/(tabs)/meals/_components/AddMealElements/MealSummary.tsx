"use client";

import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchFood, logMeal } from "../actions";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type StepsProps = {
  formData: FormData;
  setFormData: SetFormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

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

const MealSummary = ({
  formData,
  setFormData,
  setStep,
  setOpen,
}: StepsProps) => {
  return (
    <div className="flex flex-col w-full h-full justify-start gap-4">
      <DialogTitle>Summary</DialogTitle>
      <div className="flex flex-col flex-grow gap-2">
        {formData.foodEntries.map((foodEntry, i) => {
          const { foodData } = foodEntry;
          if (!foodData) return;
          const { food, nutrients, portions } = foodData;

          const servingUnit =
            food.type === "Branded" ? portions[0].servingSizeUnit : "g";

          const handleSelect = (value: string) => {
            if (value === "1" || value === "100") {
              setFormData({
                date: formData.date,
                mealType: formData.mealType,
                foodEntries: formData.foodEntries.map((foodEntry) =>
                  foodEntry.foodData.food.foodId === food.foodId
                    ? {
                        ...foodEntry,
                        servingSize: Number(value),
                        foodPortionId: undefined,
                      }
                    : foodEntry
                ),
              });
            } else {
              const portion = portions.find((portion) => portion.id === value)!;
              setFormData({
                date: formData.date,
                mealType: formData.mealType,
                foodEntries: formData.foodEntries.map((foodEntry) =>
                  foodEntry.foodData.food.foodId === food.foodId
                    ? {
                        ...foodEntry,
                        servingSize: portion.servingSize,
                        foodPortionId: value,
                      }
                    : foodEntry
                ),
              });
            }
          };

          return (
            <div className="flex flex-col justify-between items-center">
              <div className="flex justify-between w-full">
                <h2 className="text-xl">{food.description}</h2>
                <Trash
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData({
                      date: formData.date,
                      mealType: formData.mealType,
                      foodEntries: formData.foodEntries.filter(
                        (foodEntry) =>
                          foodEntry.foodData.food.foodId != food.foodId
                      ),
                    });
                  }}
                />
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
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
                        {(
                          nutrient.amount *
                          ((foodEntry.quantity * foodEntry.servingSize) / 100)
                        ).toFixed(2)}{" "}
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
                      onChange={(e) => {
                        if (typeof Number(e.target.value) === "number") {
                          setFormData({
                            date: formData.date,
                            mealType: formData.mealType,
                            foodEntries: formData.foodEntries.map((foodEntry) =>
                              foodEntry.foodData.food.foodId === food.foodId
                                ? {
                                    ...foodEntry,
                                    quantity: Number(e.target.value),
                                  }
                                : foodEntry
                            ),
                          });
                        }
                      }}
                    />
                    <Select
                      defaultValue={
                        ["100", "1"].includes(foodEntry.servingSize.toString())
                          ? foodEntry.servingSize.toString()
                          : foodEntry.foodPortionId
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
                          {portions.map((portion) => (
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
            </div>
          );
        })}
      </div>
      <DialogFooter>
        <Button type="button" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const result = await logMeal({
              foods: formData.foodEntries.map((foodEntry) => {
                const foodId = foodEntry.foodData?.food.foodId;
                const quantity = foodEntry.quantity;
                const servingSize = foodEntry.servingSize;
                const foodPortionId = foodEntry.foodPortionId;
                return {
                  foodId: foodId,
                  quantity: quantity,
                  servingSize: servingSize,
                  foodPortionId: foodPortionId,
                };
              }),
              mealType: formData.mealType,
              selectedDay: formData.date,
            });
            if (result.success) {
              setOpen(false);
            }
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MealSummary;
