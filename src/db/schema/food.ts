import {
  text,
  decimal,
  integer,
  uuid,
  pgEnum,
  AnyPgColumn,
  timestamp,
  pgTable,
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

export const nutrientTable = pgTable("nutrient", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  unitName: text("unit_name").notNull(),
  rank: integer("rank").$type<number>().notNull(),
});

export const foodTable = pgTable("food", {
  id: integer("id").primaryKey(),
  description: text("description").notNull(),
  dataType: FoodDataType("data_type"),
});

export const foodNutrientTable = pgTable("food_nutrient", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodId: integer("food_id")
    .notNull()
    .references(() => foodTable.id, { onDelete: "cascade" }),
  nutrientId: integer("nutrient_id")
    .notNull()
    .references(() => nutrientTable.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 7, scale: 2 })
    .$type<number>()
    .notNull(),
});

export const foodPortionTable = pgTable("food_portion", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodId: integer("food_id")
    .notNull()
    .references(() => foodTable.id),
  servingSize: decimal("serving_size", {
    precision: 12,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  servingSizeUnit: text("serving_size_unit").notNull(),
  householdServingFullText: text("household_serving_full_text").notNull(),
});

export const mealTable = pgTable("meal", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  mealType: text("meal_type").notNull(),
  mealTime: timestamp("meal_time", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  totalCalories: decimal("total_calories", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  totalProtein: decimal("total_protein", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  totalCarbs: decimal("total_carbs", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  totalFats: decimal("total_fats", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  ...timestampMixin(),
});

export const mealFoodTable = pgTable("meal_food", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealId: uuid("meal_id")
    .notNull()
    .references((): AnyPgColumn => mealTable.id, { onDelete: "cascade" }),
  foodId: integer("food_id")
    .notNull()
    .references(() => foodTable.id),
  portionId: uuid("portion_id").references(
    (): AnyPgColumn => foodPortionTable.id
  ),
  servingSize: decimal("serving_size", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull()
    .default(1),
});

export type Food = typeof foodTable.$inferSelect;
export type Nutrient = typeof nutrientTable.$inferSelect;
export type FoodNutrient = typeof foodNutrientTable.$inferSelect;
export type FoodPortion = typeof foodPortionTable.$inferSelect;
export type Meal = typeof mealTable.$inferInsert;
export type MealFoods = typeof mealFoodTable.$inferInsert;
