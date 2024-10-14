import React, { cache, useCallback, useEffect, useState } from "react";
import { fetchFood, fetchFoods } from "../actions";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Heart, Loader2 } from "lucide-react";
import AddFoodDrawer from "../AddFoodDrawer";
import { Input } from "@/components/ui/input";

type FoodResults = Awaited<ReturnType<typeof fetchFoods>>;
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

const AddFoodToMeal = ({ formData, setFormData, setStep }: StepsProps) => {
  const [foods, setFoods] = useState<FoodResults | undefined>();
  const [selectedFoodData, setSelectedFoodData] = useState<FoodResult | null>(
    null
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const getFoodData = cache(fetchFood);
  const getFoods = cache(fetchFoods);

  const search = useCallback(async (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFoods([]);
      return;
    }

    const data = await getFoods(searchTerm);

    setFoods(data);
  }, []);

  const select = useCallback(async (id: number) => {
    if (!id) return;
    setOpen(true);
    setSelectedFoodData(null);
    const data = await getFoodData(id);
    setSelectedFoodData(data);
  }, []);

  useEffect(() => {
    if (query.length < 3) return;
    const delayDebounceFn = setTimeout(() => {
      search(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search]);

  return (
    <div className="flex flex-col w-full h-full justify-start gap-4">
      <DialogTitle>Add food</DialogTitle>
      <Input
        placeholder="Search Food"
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="space-y-2 overflow-y-scroll flex-grow">
        {foods?.map((food) => (
          <li
            key={food.id}
            className="flex items-center justify-between p-1 bg-secondary rounded-md"
            onClick={() => {
              select(food.id);
            }}
          >
            <Button
              variant="ghost"
              className="flex-grow text-left justify-start font-normal"
            >
              {food.description}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {}}
              aria-label={"Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${"text-primary"}`} />
            </Button>
          </li>
        ))}
      </ul>
      <DialogFooter className="flex gap-2">
        <Button type="button" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="button" onClick={() => setStep(3)}>
          View Summary ({formData.foodEntries.length})
        </Button>
      </DialogFooter>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className="min-h-[200px] flex flex-col justify-center"
          container={document.getElementById("dialogContainer")}
        >
          <DrawerTitle className="px-4 py-2 flex items-center justify-between">
            {selectedFoodData && (
              <>
                <p>{selectedFoodData.food.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={"Add to favorites"}
                >
                  <Heart className={`w-4 h-4 ${"text-primary"}`} />
                </Button>
              </>
            )}
          </DrawerTitle>
          {!selectedFoodData ? (
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <AddFoodDrawer
              foodData={selectedFoodData}
              formData={formData}
              setFormData={setFormData}
              setOpen={setOpen}
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddFoodToMeal;
