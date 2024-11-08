"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  fetchFavoriteFoods,
  fetchFood,
  fetchInitialFoodSuggestions,
  fetchRecentFoods,
} from "../actions";
import SelectMealType from "./AddMealElements/SelectMealType";
import AddFoodToMeal from "./AddMealElements/AddFoodToMeal";
import MealSummary from "./AddMealElements/MealSummary";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getDateFromSearchParams } from "@/lib/utils";

type FormData = {
  id?: string;
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
  initialFoodSuggestionspromise,
  favoriteFoodspromise,
  recentFoodspromise,
}: {
  initialFoodSuggestionspromise: ReturnType<typeof fetchInitialFoodSuggestions>;
  recentFoodspromise: ReturnType<typeof fetchRecentFoods>;
  favoriteFoodspromise: ReturnType<typeof fetchFavoriteFoods>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateString = searchParams.get("date");
  const today = getDateFromSearchParams(dateString);

  const initialForm: FormData = {
    mealType: "",
    foodEntries: [],
    date: today,
  };

  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isPending, startTransition] = useTransition();
  const [optimisticDate, setOptimisticDate] = useOptimistic(today);

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
            initialFoodSuggestionspromise={initialFoodSuggestionspromise}
            favoriteFoodspromise={favoriteFoodspromise}
            recentFoodspromise={recentFoodspromise}
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
            handleDateParams={handleDateParams}
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
      <Dialog
        open={open}
        onOpenChange={() => {
          setStep(1);
          setFormData(initialForm);
          setOpen(!open);
        }}
      >
        <DialogTrigger asChild>
          <Button size={"sm"}>Add Meal</Button>
        </DialogTrigger>
        <DialogContent
          id="dialogContainer"
          className="h-full md:max-h-[80vh] max-w-4xl overflow-hidden flex flex-col items-center justify-between"
        >
          {render()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMeal;
