"use client";

import React, {
  ReactNode,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, getDateFromSearchParams, getStartOfWeek } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import AddMeal from "./AddMeal";
import { useRouter, useSearchParams } from "next/navigation";

const weekMap: Record<string, string> = {
  "0": "Sun",
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
};

const MealLoggerHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const today = getDateFromSearchParams(date);

  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(today));
  const [isPending, startTransition] = useTransition();
  const [optimisticDate, setOptimisticDate] = useOptimistic(today);

  const handleDateParams = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    const dateString = date.toDateString();
    params.set("date", dateString);
    startTransition(() => {
      setOptimisticDate(date);
      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="peer" data-pending={isPending ? "true" : undefined}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <p className="text-lg font-semibold md:text-2xl">Meal Logger</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-center gap-2">
          <AddMeal />
          <div className="flex gap-1 items-center justify-between">
            <Button
              onClick={() => {
                const newDate = new Date(optimisticDate);
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
                    !optimisticDate && "text-muted-foreground"
                  )}
                >
                  {optimisticDate ? (
                    format(optimisticDate, "PP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown"
                  fromDate={new Date("1990-01-01")}
                  toDate={new Date()}
                  mode="single"
                  selected={optimisticDate}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      setWeekStart(getStartOfWeek(newDate));
                      handleDateParams(date);
                    }
                  }}
                  disabled={(date: Date) => date < new Date("1900-01-01")}
                  required
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
                onClick={() => handleDateParams(thisDay)}
                className={cn(
                  "col-span-1 flex h-full cursor-pointer flex-col items-center justify-center rounded-md bg-muted py-2",
                  {
                    "bg-primary":
                      optimisticDate.toDateString() === thisDay.toDateString(),
                  }
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
    </div>
  );
};

export default MealLoggerHeader;
