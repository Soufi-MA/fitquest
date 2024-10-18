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
    <div className="col-span-full flex flex-col rounded-md bg-gradient-to-tl from-primary/10 to-primary/20">
      <MealLoggerHeader
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <Separator />
      <div className="flex w-full flex-col lg:flex-row">
        <MealLoggerSummary selectedDay={selectedDay} />
        <MealLoggerDetails selectedDay={selectedDay} />
      </div>
    </div>
  );
};

export default MealLogger;
