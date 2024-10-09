"use client";
import React, { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
// import colors from "tailwind.config";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Food } from "@/db/schema/food";
import { fetchFoods } from "./actions";

const consumed = {
  calories: 1588,
  protein: 24,
  carbs: 121,
  fat: 68,
};

const goal = {
  calories: 2000,
  protein: 200,
  carbs: 160,
  fat: 75,
};

const MealLoggerSummary = ({
  selectedDay,
}: {
  selectedDay: Date | undefined;
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Food>();

  const [foods, setFoods] = useState<Food[] | null>();
  // const { mutate: fetchFoods, data: foods } =
  //   api.users.searchFood.useMutation();

  const DialogDrawerContent = () => (
    <div>
      <p className="py-4 text-center text-2xl font-semibold">Add Food</p>
      <p>{selectedDay?.toDateString()}</p>
      <div className="flex flex-col gap-2">
        <Label>Search Food</Label>
        <Input
          ref={searchRef}
          onChange={async (e) => {
            const foods = await fetchFoods(e.target.value);
            setFoods(foods);
          }}
        />
      </div>
      {foods && foods.length > 0 && (
        <div className="absolute top-40 mt-1 flex flex-col rounded-md border bg-background">
          {foods.map((food: Food) => {
            // const kal = food.foodNutrients.find(
            //   (nutrient) => nutrient.nCode === "208"
            // )?.amount;
            return (
              <div
                onClick={() => {
                  fetchFoods("");
                  setSelected(food);
                }}
                className="flex cursor-pointer flex-col px-4 py-2 md:hover:bg-muted"
                key={food.id}
              >
                <p>{food.description}</p>
                {/*<p>{kal + " Cal"}</p>*/}
              </div>
            );
          })}
        </div>
      )}
      {selected && <div>{selected.description}</div>}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 border-r py-4">
      <div className="flex h-full min-h-[200px] w-full justify-between">
        <ResponsiveContainer className="flex-1">
          <PieChart width={200} height={200}>
            <text
              // fill={colors.theme.extend.colors.foreground}
              x={"50%"}
              y={"30%"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              Calories
            </text>
            <text
              // fill={colors.theme.extend.colors.foreground}
              x={"50%"}
              y={"50%"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 28, fontWeight: "bold" }}
            >
              {consumed.calories}
            </text>
            <text
              // fill={colors.theme.extend.colors.foreground}
              x={"50%"}
              y={"65%"}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              of {goal.calories}
            </text>
            <Pie
              data={[
                {
                  name: "Consumed",
                  value: consumed.calories,
                },
                {
                  name: "Remaining",
                  value: goal.calories - consumed.calories,
                },
              ]}
              dataKey="value"
              innerRadius="90%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              cornerRadius={300}
              paddingAngle={0}
              blendStroke
            >
              {[1, 2].map((_, i) => (
                <Cell
                  key={i}
                  // fill={
                  //   i === 0
                  //     ? colors.theme.extend.colors.primary.DEFAULT
                  //     : colors.theme.extend.colors.background
                  // }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <Drawer>
            <DrawerTrigger
              className={cn(
                buttonVariants(),
                "absolute right-2 top-0 flex justify-between gap-1 md:hidden"
              )}
            >
              <Plus />
              Add
            </DrawerTrigger>
            <DrawerContent className="flex h-[90vh] flex-col px-4 py-2 md:hidden">
              {DialogDrawerContent()}
            </DrawerContent>
          </Drawer>
          <Dialog>
            <DialogTrigger
              className={cn(
                buttonVariants(),
                "absolute right-2 top-0 flex justify-between gap-1 max-md:hidden"
              )}
            >
              <Plus />
              Add
            </DialogTrigger>
            <DialogContent className="flex h-[90vh] flex-col px-4 py-2 max-md:hidden">
              {DialogDrawerContent()}
            </DialogContent>
          </Dialog>
          <p className="text-lg">Remaining Calories</p>
          <p className="text-2xl font-semibold">
            {goal.calories - consumed.calories}
          </p>
        </div>
      </div>
      <div className="flex min-h-[162px] w-full items-center justify-around">
        <div className="flex h-full flex-1 flex-col items-center pb-4">
          <ResponsiveContainer>
            <PieChart>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"40%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 18, fontWeight: "bold" }}
              >
                {consumed.carbs}
              </text>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"60%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 14 }}
              >
                of {goal.carbs}
              </text>
              <Pie
                data={[
                  {
                    name: "Consumed",
                    value: consumed.carbs,
                  },
                  {
                    name: "Remaining",
                    value: goal.carbs - consumed.carbs,
                  },
                ]}
                dataKey="value"
                innerRadius="90%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                cornerRadius={300}
                paddingAngle={0}
                blendStroke
              >
                {[1, 2].map((_, i) => (
                  <Cell
                    key={i}
                    // fill={
                    //   i === 0
                    //     ? "#90ee90"
                    //     : colors.theme.extend.colors.background
                    // }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="font-semibold">Carbs</p>
        </div>
        <div className="flex h-full flex-1 flex-col items-center pb-4">
          <ResponsiveContainer>
            <PieChart>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"40%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 18, fontWeight: "bold" }}
              >
                {consumed.protein}
              </text>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"60%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 14 }}
              >
                of {goal.protein}
              </text>
              <Pie
                data={[
                  {
                    name: "Consumed",
                    value: consumed.protein,
                  },
                  {
                    name: "Remaining",
                    value: goal.protein - consumed.protein,
                  },
                ]}
                dataKey="value"
                innerRadius="90%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                cornerRadius={300}
                paddingAngle={0}
                blendStroke
              >
                {[1, 2].map((_, i) => (
                  <Cell
                    key={i}
                    // fill={
                    //   i === 0
                    //     ? "#FF0000"
                    //     : colors.theme.extend.colors.background
                    // }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="font-semibold">Protein</p>
        </div>
        <div className="flex h-full flex-1 flex-col items-center pb-4">
          <ResponsiveContainer>
            <PieChart>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"40%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 18, fontWeight: "bold" }}
              >
                {consumed.fat}
              </text>
              <text
                // fill={colors.theme.extend.colors.foreground}
                x={"50%"}
                y={"60%"}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 14 }}
              >
                of {goal.fat}
              </text>
              <Pie
                data={[
                  {
                    name: "Consumed",
                    value: (consumed.fat * 100) / goal.fat,
                  },
                  {
                    name: "Remaining",
                    value: ((goal.fat - consumed.fat) * 100) / goal.fat,
                  },
                ]}
                dataKey="value"
                innerRadius="90%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                cornerRadius={300}
                paddingAngle={0}
                blendStroke
              >
                {[1, 2].map((_, i) => (
                  <Cell
                    key={i}
                    // fill={
                    //   i === 0
                    //     ? "#ADD8E6"
                    //     : colors.theme.extend.colors.background
                    // }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="font-semibold">Fat</p>
        </div>
      </div>
    </div>
  );
};

export default MealLoggerSummary;
