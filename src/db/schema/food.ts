import {
  text,
  pgTableCreator,
  decimal,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

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
    }).$type<number>(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.foodId, table.measureUnitId] }),
    };
  }
);

export type Food = typeof foodTable.$inferSelect;
