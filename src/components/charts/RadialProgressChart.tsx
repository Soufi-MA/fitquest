"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {} satisfies ChartConfig;

export function RadialProgressChart({
  label,
  data,
  current,
}: {
  label: string;
  data: { name: string; progress: number; value: number; fill: string }[];
  current?: number;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto h-[200px] sm:h-[300px] aspect-square"
    >
      <RadialBarChart
        endAngle={-45}
        startAngle={225}
        data={data}
        innerRadius={"85%"}
        outerRadius={"110%"}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="progress" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl sm:text-4xl font-bold"
                    >
                      {current
                        ? (current - data[0].value).toFixed(0)
                        : data[0].value.toFixed(0)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="fill-muted-foreground text-sm sm:text-lg"
                    >
                      {label}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
