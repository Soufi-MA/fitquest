"use server";

import { db } from "@/db/connection";
import { foodTable } from "@/db/schema/food";
import { ilike } from "drizzle-orm";

export const fetchFoods = async (query: string) => {
  //   const query = formData.get("query") as string;

  const foods = await db
    .select()
    .from(foodTable)
    .where(ilike(foodTable.description, `%${query}%`))
    .limit(10);

  return foods;
};
