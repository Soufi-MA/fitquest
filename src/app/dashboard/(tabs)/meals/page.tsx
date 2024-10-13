import React from "react";
import MealLogger from "./_components/MealLogger";

const page = () => {
  return (
    <div className="px-2 py-2 md:px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <MealLogger />
      </div>
    </div>
  );
};

export default page;
