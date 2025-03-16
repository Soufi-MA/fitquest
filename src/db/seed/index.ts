import path from "path";
import fs from "fs/promises";
import { parse } from "csv-parse";
import { db } from "../connection";
import {
  foodTable,
  nutrientTable,
  foodNutrientTable,
  foodPortionTable,
  Food,
  Nutrient,
  FoodNutrient,
  FoodPortion,
} from "../schema/food";

const parseCsv = async <T>(filePath: string): Promise<T[]> => {
  const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
  return new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records as T[]);
        }
      }
    );
  });
};

const batchInsert = async <T>(
  tx: typeof db,
  table: any,
  data: T[],
  batchSize: number = 1000
) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await tx.insert(table).values(batch);
  }
};

const seed = async () => {
  try {
    const dataDir = path.join(__dirname, "data");

    await db.transaction(async (tx) => {
      console.log("Seeding food...");
      const foodData = await parseCsv<Food>(path.join(dataDir, "food.csv"));
      await batchInsert(
        tx,
        foodTable,
        foodData.map((f) => ({
          id: f.id,
          description: f.description,
          dataType: f.dataType,
        }))
      );

      console.log("Seeding nutrient...");
      const nutrientData = await parseCsv<Nutrient>(
        path.join(dataDir, "nutrient.csv")
      );
      await batchInsert(
        tx,
        nutrientTable,
        nutrientData.map((n) => ({
          id: n.id,
          name: n.name,
          unitName: n.unitName,
          rank: n.rank,
        }))
      );

      console.log("Seeding food_nutrient...");
      const foodNutrientData = await parseCsv<FoodNutrient>(
        path.join(dataDir, "food_nutrient.csv")
      );
      await batchInsert(
        tx,
        foodNutrientTable,
        foodNutrientData.map((fn) => ({
          foodId: fn.foodId,
          nutrientId: fn.nutrientId,
          amount: fn.amount,
        }))
      );

      console.log("Seeding food_portion...");
      const foodPortionData = await parseCsv<FoodPortion>(
        path.join(dataDir, "food_portion.csv")
      );
      await batchInsert(
        tx,
        foodPortionTable,
        foodPortionData.map((fp) => ({
          foodId: fp.foodId,
          servingSize: fp.servingSize,
          servingSizeUnit: fp.servingSizeUnit,
          householdServingFullText: fp.householdServingFullText,
        }))
      );
    });

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
