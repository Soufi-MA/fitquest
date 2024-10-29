import React from "react";
import MealLogger from "./_components/MealLogger";

type PageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const { date } = await searchParams;

  return (
    <div className="px-2 py-2 md:px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <MealLogger date={date} />
      </div>
    </div>
  );
};

export default page;
