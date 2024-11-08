import React, { cache, useCallback, useEffect, useState } from "react";
import {
  fetchFavoriteFoods,
  fetchFood,
  fetchFoods,
  fetchInitialFoodSuggestions,
  fetchRecentFoods,
  toggleFavoriteFood,
} from "../../actions";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Heart, Loader2, Search } from "lucide-react";
import AddFoodDrawer from "../AddFoodDrawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  initialFoodSuggestionspromise: ReturnType<typeof fetchInitialFoodSuggestions>;
  recentFoodspromise: ReturnType<typeof fetchRecentFoods>;
  favoriteFoodspromise: ReturnType<typeof fetchFavoriteFoods>;
};

const AddFoodToMeal = ({
  formData,
  setFormData,
  setStep,
  initialFoodSuggestionspromise,
  favoriteFoodspromise,
  recentFoodspromise,
}: StepsProps) => {
  const [initialFoodSuggestions, setInitialFoodSuggestions] = useState<
    FoodResults | undefined
  >();
  const [foods, setFoods] = useState<FoodResults | undefined>();
  const [favorites, setFavorites] = useState<FoodResults | undefined>();
  const [recent, setRecent] = useState<FoodResults | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState("all");

  const [selectedFoodData, setSelectedFoodData] = useState<FoodResult | null>(
    null
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const getFoodData = cache(fetchFood);
  const getFoods = cache(fetchFoods);

  useEffect(() => {
    const fetchInitialFoodSuggestions = async () => {
      setIsLoading(true);
      const initialFoodSuggestions = await initialFoodSuggestionspromise;
      setInitialFoodSuggestions(initialFoodSuggestions);
      setIsLoading(false);
    };

    fetchInitialFoodSuggestions();
  }, []);

  useEffect(() => {
    const fetchFavoriteFoods = async () => {
      const favoriteFoods = await favoriteFoodspromise;
      if (favoriteFoods) {
        setFavorites(favoriteFoods);
      }
    };
    fetchFavoriteFoods();
  }, [favoriteFoodspromise]);

  useEffect(() => {
    const fetchRecentFoods = async () => {
      const recentFoods = await recentFoodspromise;
      if (recentFoods) {
        setRecent(recentFoods);
      }
    };
    fetchRecentFoods();
  }, [recentFoodspromise]);

  const search = useCallback(async (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFoods([]);
      return;
    }

    setIsLoading(true);
    const data = await getFoods(searchTerm);
    setIsLoading(false);

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

  const FoodItem = ({ food }: { food: FoodResult["food"] }) => {
    const [isAdding, setIsAdding] = useState(false);
    const isFavorite = favorites
      ? favorites.some((favorite) => favorite.id === food.id)
      : false;

    return (
      <li
        key={food.id}
        className="flex items-center justify-between p-1 bg-secondary rounded-md"
      >
        <Button
          variant="ghost"
          className="flex-grow text-left justify-start font-normal truncate"
          onClick={() => {
            select(food.id);
          }}
        >
          {food.description}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={async (e) => {
            setIsAdding(true);
            await toggleFavoriteFood(food.id);
            setIsAdding(false);
          }}
          aria-label={"Add to favorites"}
        >
          {isAdding ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Heart
              fill={isFavorite ? "red" : "transparent"}
              className={`w-4 h-4 `}
            />
          )}
        </Button>
      </li>
    );
  };

  const FoodDrawerHeader = ({
    selectedFoodData,
  }: {
    selectedFoodData: FoodResult;
  }) => {
    const [isAdding, setIsAdding] = useState(false);
    const isFavorite = favorites
      ? favorites.some((favorite) => favorite.id === selectedFoodData.food.id)
      : false;
    return (
      <>
        <p>{selectedFoodData.food.description}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={async (e) => {
            setIsAdding(true);
            await toggleFavoriteFood(selectedFoodData.food.id);
            setIsAdding(false);
          }}
          aria-label={"Add to favorites"}
        >
          {isAdding ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Heart
              fill={isFavorite ? "red" : "transparent"}
              className={`w-4 h-4 `}
            />
          )}
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col w-full h-full justify-between gap-4">
      <DialogTitle>Add food</DialogTitle>
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search Food"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Tabs
        value={selectedTab}
        className="flex flex-col w-full flex-grow justify-start"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" onClick={() => setSelectedTab("all")}>
            All
          </TabsTrigger>
          <TabsTrigger
            value="favorite"
            onClick={() => setSelectedTab("favorite")}
          >
            Favorite
          </TabsTrigger>
          <TabsTrigger value="recent" onClick={() => setSelectedTab("recent")}>
            Recent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="h-1 flex-grow overflow-y-auto">
          {!isLoading ? (
            <ul className="space-y-2">
              {(query.length > 0 ? foods : initialFoodSuggestions)?.map(
                (food) => (
                  <FoodItem key={food.id} food={food} />
                )
              )}
            </ul>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorite" className="h-1 flex-grow overflow-y-auto">
          {favorites?.length ? (
            <ul className="space-y-2">
              {favorites?.map((food) => (
                <FoodItem key={food.id} food={food} />
              ))}
            </ul>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p>Add favorites by clicking the heart next to food items</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="h-1 flex-grow overflow-y-auto">
          {recent?.length ? (
            <ul className="space-y-2">
              {recent?.map((food) => (
                <FoodItem key={food.id} food={food} />
              ))}
            </ul>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p>You last logged foods will be displayed here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <DialogFooter className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        <Button
          className="md:col-start-3"
          type="button"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          className="md:col-start-4"
          type="button"
          onClick={() => setStep(3)}
        >
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
              <FoodDrawerHeader selectedFoodData={selectedFoodData} />
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
