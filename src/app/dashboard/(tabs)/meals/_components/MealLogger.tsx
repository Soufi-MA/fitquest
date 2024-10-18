"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import MealLoggerHeader from "./MealLoggerHeader";
import MealLoggerSummary from "./MealLoggerSummary";
import MealLoggerDetails from "./MealLoggerDetails";
import { fetchMealDetails } from "./actions";

const MealLogger = () => {
  const [selectedDay, _setSelectedDay] = useState<Date>(
    new Date(new Date().setHours(6, 0, 0, 0))
  );

  const setSelectedDay = (date: Date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(6, 0, 0, 0);
    _setSelectedDay(updatedDate);
  };
  type MealDetailsResult = Awaited<ReturnType<typeof fetchMealDetails>>;

  const [mealDetails, setMealDetails] = useState<MealDetailsResult>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async (selectedDay: Date) => {
      setLoading(true);
      const details = await fetchMealDetails(selectedDay);
      setMealDetails(details);
      setLoading(false);
    };
    fetch(selectedDay);
  }, [selectedDay]);

  return (
    <div className="col-span-full flex flex-col rounded-md bg-gradient-to-tl from-primary/10 to-primary/20 border">
      <MealLoggerHeader
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full flex-col lg:flex-row sm:h-[412px] overflow-hidden">
        <MealLoggerSummary mealDetails={mealDetails} />
        <MealLoggerDetails loading={loading} mealDetails={mealDetails} />
      </div>
    </div>
  );
};

export default MealLogger;
