import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MealLoggerDetails = ({
  selectedDay,
}: {
  selectedDay: Date | undefined;
}) => {
  return (
    <>
      <div className="flex w-full justify-center lg:hidden">
        <p>View Details</p>
      </div>
      <div className="flex flex-1 max-lg:hidden">
        <ScrollArea className="max-h-[412px] w-full">
          <p>{selectedDay?.toDateString()}</p>
          <div className="flex w-20 min-w-20 flex-col items-center border-r py-2">
            {[
              6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1,
              2, 3, 4, 5,
            ].map((number, i) => (
              <Hours
                key={i}
                hour={`${number} ${i > 6 && i <= 18 ? "PM" : "AM"}`}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
const Hours = ({ hour }: { hour: string }) => (
  <div className="flex h-12 w-full items-center">
    <p className="w-[80%] text-nowrap pl-4 text-left">{hour}</p>
    <Separator className="w-[20%]" />
  </div>
);

export default MealLoggerDetails;
