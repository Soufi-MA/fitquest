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
import { fetchFood, logMeal } from "../../actions";
import { CalendarIcon, Clock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import NutrientsProportionsChart from "./NutrientsProportionsChart";
import { TimePicker12Demo } from "@/components/ui/time-picker/time-picker-12h-demo";

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
  setSelectedDay,
}: StepsProps & { setSelectedDay: (date: Date) => void }) => {
  return (
    <div className="flex flex-col w-full h-full justify-start gap-4">
      <DialogTitle>Summary</DialogTitle>
      <div className="flex flex-col flex-grow gap-2 overflow-y-scroll">
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
            <div
              key={i}
              className="flex flex-col justify-between items-center py-2 border-b"
            >
              <div className="flex justify-between w-full px-2">
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
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 w-full">
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <NutrientsProportionsChart
                    calories={
                      (nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Energy")
                      )?.amount ?? 0) *
                      ((foodEntry.quantity * foodEntry.servingSize) / 100)
                    }
                    carbs={
                      (nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Carbohydrate")
                      )?.amount ?? 0) *
                      ((foodEntry.quantity * foodEntry.servingSize) / 100)
                    }
                    fats={
                      (nutrients.find(
                        (nutrient) => nutrient.name === "Total lipid (fat)"
                      )?.amount ?? 0) *
                      ((foodEntry.quantity * foodEntry.servingSize) / 100)
                    }
                    protein={
                      (nutrients.find((nutrient) =>
                        nutrient.name.startsWith("Protein")
                      )?.amount ?? 0) *
                      ((foodEntry.quantity * foodEntry.servingSize) / 100)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Quantity"
                      defaultValue={Number(foodEntry.quantity)}
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
      <DialogFooter className="grid md:grid-cols-4 grid-cols-2 gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? (
                format(formData.date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => {
                if (date) {
                  date.setHours(6, 0, 0, 0);
                  setFormData({ ...formData, date });
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <TimePicker12Demo
          date={formData.date}
          setDate={(date) => {
            if (date) {
              setFormData({ ...formData, date });
            }
          }}
        />
        <Button type="button" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const result = await logMeal({
              foods: formData.foodEntries.map((foodEntry) => {
                const foodData = foodEntry.foodData;
                const quantity = foodEntry.quantity;
                const servingSize = foodEntry.servingSize;
                const foodPortionId = foodEntry.foodPortionId;
                return {
                  foodData: foodData,
                  quantity: quantity,
                  servingSize: servingSize,
                  foodPortionId: foodPortionId,
                };
              }),
              mealType: formData.mealType,
              mealTime: formData.date,
            });
            if (result.success) {
              setSelectedDay(formData.date);
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
