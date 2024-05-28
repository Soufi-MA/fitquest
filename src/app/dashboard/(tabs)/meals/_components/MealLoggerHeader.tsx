"use client";

import React, { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { cn, getStartOfWeek } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

interface MealLoggerHeaderProps {
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
}

const weekMap: Record<string, string> = {
  "0": "Sun",
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
};

const MealLoggerHeader = ({
  selectedDay,
  setSelectedDay,
}: MealLoggerHeaderProps) => {
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(new Date()));

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <p className="text-lg font-semibold md:text-2xl">Meal Logger</p>
        </div>
        <div className="flex items-center justify-between gap-1">
          <Button
            onClick={() => {
              const newDate = new Date(weekStart);
              newDate.setDate(newDate.getDate() - 7);
              setWeekStart(newDate);
            }}
            variant={"outline"}
            className="flex h-10 w-10 p-0"
          >
            <ChevronLeft />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[140px] pl-3 text-left font-normal",
                  !selectedDay && "text-muted-foreground",
                )}
              >
                {selectedDay ? (
                  format(selectedDay, "PP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    setWeekStart(getStartOfWeek(newDate));
                    setSelectedDay(date);
                  }
                }}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              const newDate = new Date(weekStart);
              newDate.setDate(newDate.getDate() + 7);
              setWeekStart(newDate);
            }}
            variant={"outline"}
            className="h-10 w-10 p-0"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex h-20 w-full items-center justify-between bg-background px-2 py-2">
        <div className="grid flex-grow grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const thisDay = new Date(weekStart);
            thisDay.setDate(thisDay.getDate() + i);
            return (
              <div
                key={i}
                onClick={() => setSelectedDay(thisDay)}
                className={cn(
                  "col-span-1 flex h-full cursor-pointer flex-col items-center justify-center rounded-md bg-muted py-2",
                  {
                    "bg-primary":
                      selectedDay.toDateString() === thisDay.toDateString(),
                  },
                )}
              >
                <p className="text-sm text-foreground">
                  {weekMap[thisDay.getDay()]}
                </p>
                <p className="text-2xl font-semibold">{thisDay.getDate()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MealLoggerHeader;
