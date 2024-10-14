"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

import MealLoggerHeader from "./MealLoggerHeader";
import MealLoggerSummary from "./MealLoggerSummary";
import MealLoggerDetails from "./MealLoggerDetails";

const MealLogger = () => {
  const [selectedDay, _setSelectedDay] = useState<Date>(
    new Date(new Date().setHours(6, 0, 0, 0))
  );

  const setSelectedDay = (date: Date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(6, 0, 0, 0);
    _setSelectedDay(updatedDate);
  };

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
