import {
  text,
  pgTableCreator,
  decimal,
  integer,
  primaryKey,
  uuid,
  pgEnum,
  AnyPgColumn,
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

export const foodTable = createTable("food", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
  dataType: FoodDataType("data_type"),
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

export const foodPortionTable = createTable("food_portion", {
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
    .references((): AnyPgColumn => mealTable.id),
  foodId: integer("food_id")
    .notNull()
    .references(() => foodTable.id),
  portionId: uuid("portion_id").references(
    (): AnyPgColumn => foodPortionTable.id
  ),
  multiplier: decimal("multiploer", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull()
    .default(1),
  quantity: decimal("quantity", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull()
    .default(1),
});

export type Food = typeof foodTable.$inferSelect;
