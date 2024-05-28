"use client";

import React, { useState } from "react";
import { Separator } from "~/components/ui/separator";

import MealLoggerHeader from "./MealLoggerHeader";
import MealLoggerSummary from "./MealLoggerSummary";
import MealLoggerDetails from "./MealLoggerDetails";

const MealLogger = () => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  return (
    <div className="col-span-full flex flex-col rounded-md border bg-muted">
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
