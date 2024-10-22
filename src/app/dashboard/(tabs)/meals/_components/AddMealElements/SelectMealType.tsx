import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { fetchFood } from "../../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Apple, Coffee, Donut, Soup } from "lucide-react";
import {
  DialogDrawerDescription,
  DialogDrawerTitle,
} from "@/components/ui/dialog-drawer";

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

type StepsProps = {
  formData: FormData;
  setFormData: SetFormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const SelectMealType = ({ formData, setFormData, setStep }: StepsProps) => {
  const mealTypes = [
    { title: "Breakfast", icon: Coffee },
    { title: "Lunch", icon: Apple },
    { title: "Dinner", icon: Soup },
    { title: "Snack", icon: Donut },
  ];

  return (
    <div className="flex flex-col w-full h-full justify-start gap-4">
      <DialogDrawerTitle>Select Meal Type</DialogDrawerTitle>
      <DialogDrawerDescription className="hidden">
        Description
      </DialogDrawerDescription>
      <div className="grid grid-cols-2 items-center justify-center gap-2 flex-grow">
        {mealTypes.map((type) => (
          <Button
            key={type.title}
            variant={formData.mealType === type.title ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, mealType: type.title })}
            className="h-full flex flex-col gap-4"
          >
            <type.icon size={64} />
            {type.title}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4 w-full max-w-[300px] mx-auto">
        <Label htmlFor="custom" className="text-right">
          Custom
        </Label>
        <Input
          id="custom"
          placeholder="Enter custom meal"
          onChange={(e) => {
            setFormData({ ...formData, mealType: e.target.value });
          }}
          className="col-span-3"
        />
      </div>
      <DialogFooter className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        <Button
          className="col-start-2 md:col-start-4"
          disabled={!formData.mealType || formData.mealType.length < 3}
          type="submit"
          onClick={() => setStep(2)}
        >
          Next
        </Button>
      </DialogFooter>
    </div>
  );
};

export default SelectMealType;
