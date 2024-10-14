"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { fetchFood } from "./actions";
import SelectMealType from "./AddMealElements/SelectMealType";
import AddFoodToMeal from "./AddMealElements/AddFoodToMeal";
import MealSummary from "./AddMealElements/MealSummary";
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerTrigger,
} from "@/components/ui/dialog-drawer";
import { Button } from "@/components/ui/button";

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

type FoodResult = Awaited<ReturnType<typeof fetchFood>>;

const AddMeal = ({
  selectedDay,
  setSelectedDay,
}: {
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
}) => {
  const initialForm: FormData = {
    mealType: "",
    foodEntries: [],
    date: selectedDay,
  };

  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialForm);

  const render = () => {
    switch (step) {
      case 1:
        return (
          <SelectMealType
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        );
      case 2:
        return (
          <AddFoodToMeal
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <MealSummary
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
            setOpen={setOpen}
            setSelectedDay={setSelectedDay}
          />
        );
      default:
        return (
          <SelectMealType
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        );
    }
  };

  return (
    <>
      <DialogDrawer
        open={open}
        onOpenChange={() => {
          setStep(1);
          setFormData(initialForm);
          setOpen(!open);
        }}
      >
        <DialogDrawerTrigger asChild>
          <Button size={"sm"}>Add Meal</Button>
        </DialogDrawerTrigger>
        <DialogDrawerContent
          id="dialogContainer"
          className="h-full max-h-[80vh] max-w-4xl overflow-hidden flex flex-col items-center justify-between"
        >
          {render()}
        </DialogDrawerContent>
      </DialogDrawer>
    </>
  );
};

export default AddMeal;
