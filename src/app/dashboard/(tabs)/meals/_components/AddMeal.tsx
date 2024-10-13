"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cache, useCallback, useEffect, useState } from "react";
import { fetchFood, fetchFoods } from "./actions";
import SelectMealType from "./AddMealElements/SelectMealType";
import AddFoodToMeal from "./AddMealElements/AddFoodToMeal";
import MealSummary from "./AddMealElements/MealSummary";

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

type FoodResults = Awaited<ReturnType<typeof fetchFoods>>;
type FoodResult = Awaited<ReturnType<typeof fetchFood>>;

const AddMeal = ({ selectedDay }: { selectedDay: Date }) => {
  const initialForm: FormData = {
    mealType: "",
    foodEntries: [],
    date: selectedDay,
  };

  const [foods, setFoods] = useState<FoodResults | undefined>();
  const [query, setQuery] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>(initialForm);

  const getFoods = cache(fetchFoods);

  const search = useCallback(async (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFoods([]);
      return;
    }

    const data = await getFoods(searchTerm);

    setFoods(data);
  }, []);

  useEffect(() => {
    if (query.length < 3) return;
    const delayDebounceFn = setTimeout(() => {
      search(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search]);

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
            setQuery={setQuery}
            foods={foods}
          />
        );
      case 3:
        return (
          <MealSummary
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
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
    <Dialog
      onOpenChange={() => {
        setStep(1);
        setFoods(undefined);
        setFormData(initialForm);
      }}
    >
      <DialogTrigger>Add Meal</DialogTrigger>
      <DialogContent
        id="dialogContainer"
        className="h-full max-h-[80vh] max-w-4xl overflow-hidden flex flex-col items-center justify-between"
      >
        {render()}
      </DialogContent>
    </Dialog>
  );
};

export default AddMeal;
