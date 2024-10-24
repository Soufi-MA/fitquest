import {
  text,
  pgTableCreator,
  decimal,
  integer,
  primaryKey,
  uuid,
  pgEnum,
  AnyPgColumn,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { timestampMixin } from "@/lib/utils";
import { sql } from "drizzle-orm";

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
  rank: integer("rank").$type<number>().notNull(),
});

export const foodTable = createTable(
  "food",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    description: text("description").notNull(),
    dataType: FoodDataType("data_type"),
  },
  (table) => ({
    descriptionSearchIndex: index("description_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.description})`
    ),
  })
);

export const foodNutrientTable = createTable(
  "food_nutrient",
  {
    foodId: integer("food_id")
      .notNull()
      .references(() => foodTable.id, { onDelete: "cascade" }),
    nutrientId: integer("nutrient_id")
      .notNull()
      .references(() => nutrientTable.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 })
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

export const mealFoodTable = createTable("meal_food", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealId: uuid("meal_id")
    .notNull()
    .references((): AnyPgColumn => mealTable.id),
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
export type Meal = typeof mealTable.$inferInsert;
export type MealFoods = typeof mealFoodTable.$inferInsert;
