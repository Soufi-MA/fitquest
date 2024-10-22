"use client";

import React from "react";
import { Label, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const NutrientsProportionsChart = ({
  calories,
  carbs,
  fats,
  protein,
}: {
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
}) => {
  const total = carbs + fats + protein;

  const carbsPercentage = (carbs / total) * 100 || 0;
  const fatsPercentage = (fats / total) * 100 || 0;
  const proteinPercentage = (protein / total) * 100 || 0;

  const chartData = [
    {
      nutrient: "protein",
      value: protein,
      fill: "#4CAF50",
    },
    { nutrient: "carbs", value: carbs, fill: "#d0bf2a" },
    { nutrient: "fats", value: fats, fill: "#FF5722" },
  ];

  const chartConfig = {
    value: {
      label: "Value",
    },
    protein: {
      label: "Protein",
    },
    carbs: {
      label: "Carbs",
    },
    fats: {
      label: "Fats",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-4 justify-between items-center py-4">
      <ChartContainer
        config={chartConfig}
        className="flex mx-auto aspect-square h-[100px] items-center justify-center"
      >
        <PieChart className="flex items-center justify-center">
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="nutrient"
            innerRadius={25}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 6}
                        className="fill-foreground text-sm font-bold"
                      >
                        {Math.round(Number(calories)).toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 8}
                        className="fill-muted-foreground"
                      >
                        Cal
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col items-center">
        <p className="text-[#d0bf2a]">
          {parseFloat(carbsPercentage.toFixed(0))}%
        </p>
        <p className="text-xl">{parseFloat(carbs.toFixed(2))}g</p>
        <p className="text-xs">Carbs</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-[#FF5722]">
          {parseFloat(fatsPercentage.toFixed(0))}%
        </p>
        <p className="text-xl">{parseFloat(fats.toFixed(2))}g</p>
        <p className="text-xs">Fat</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-[#4CAF50]">
          {parseFloat(proteinPercentage.toFixed(0))}%
        </p>
        <p className="text-xl">{parseFloat(protein.toFixed(2))}g</p>
        <p className="text-xs">Protein</p>
      </div>
    </div>
  );
};

export default NutrientsProportionsChart;
