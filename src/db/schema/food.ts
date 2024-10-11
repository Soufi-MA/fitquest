import {
  text,
  pgTableCreator,
  decimal,
  integer,
  primaryKey,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { timestampMixin } from "@/lib/utils";

export const FoodDataType = pgEnum("data_type", [
  "Branded",
  "Foundation",
  "Survey (FNDDS)",
]);
export const MealTypeEnum = pgEnum("meal_type", [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
]);

const createTable = pgTableCreator((name) => `fitquest_${name}`);

export const nutrientTable = createTable("nutrient", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  unitName: text("unit_name").notNull(),
});

export const measureUnitTable = createTable("measure_unit", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
});

export const foodCategoryTable = createTable("food_category", {
  description: text("description").primaryKey(),
});

export const foodTable = createTable("food", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
  category: text("category").references(() => foodCategoryTable.description),
  dataType: FoodDataType("data_type"),
  servingSize: decimal("serving_size", {
    precision: 12,
    scale: 2,
  }).$type<number>(),
  servingSizeUnit: text("serving_size_unit"),
  householdServingFullText: text("household_serving_full_text"),
});

export const foodNutrientTable = createTable(
  "food_nutrient",
  {
    foodId: integer("food_id")
      .notNull()
      .references(() => foodTable.id),
    nutrientId: integer("nutrient_id")
      .notNull()
      .references(() => nutrientTable.id),
    amount: decimal("amount", { precision: 12, scale: 2 })
      .$type<number>()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.foodId, table.nutrientId] }),
    };
  }
);

export const foodPortionTable = createTable(
  "food_portion",
  {
    foodId: integer("food_id")
      .notNull()
      .references(() => foodTable.id),
    measureUnitId: integer("measure_unit_id")
      .notNull()
      .references(() => measureUnitTable.id),
    gramWeight: decimal("gram_weight", {
      precision: 10,
      scale: 2,
    })
      .$type<number>()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.foodId, table.measureUnitId] }),
    };
  }
);

export const mealTable = createTable("meal", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  mealType: MealTypeEnum("meal_type").notNull(),
  ...timestampMixin(),
});

export const mealFoodTable = createTable("meal_food", {
  mealId: uuid("meal_id")
    .notNull()
    .references(() => mealTable.id),
  foodId: integer("food_id")
    .notNull()
    .references(() => foodTable.id),
  servingText: text("serving_text").notNull(),
  servingSize: decimal("serving_size", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull()
    .default(1),
});

export type Food = typeof foodTable.$inferSelect;
