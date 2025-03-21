import { sql } from "drizzle-orm";
import {
  timestamp,
  text,
  date,
  uuid,
  decimal,
  uniqueIndex,
  integer,
  pgTable,
  unique,
} from "drizzle-orm/pg-core";
import { foodTable } from "./food";
import {
  activityLevelEnum,
  genderEnum,
  goalRateEnum,
  goalStatusEnum,
  goalTypeEnum,
  lengthUnitEnum,
  onboardingStatusEnum,
  planEnum,
  weightUnitEnum,
} from "./enums";

export const userTable = pgTable("user", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  profilePicture: text("profile_picture"),
  gender: genderEnum("gender"),
  birthDay: date("birth_day", {
    mode: "date",
  }),
  height: decimal("height", { precision: 10, scale: 2 }).$type<number>(),
  weight: decimal("weight", { precision: 10, scale: 2 }).$type<number>(),
  activityLevel:
    activityLevelEnum("activity_level").default("MODERATELY_ACTIVE"),
  plan: planEnum("plan").notNull().default("FREE"),
  onboardingStatus: onboardingStatusEnum("onboading_status")
    .default("PENDING")
    .notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const goalTable = pgTable(
  "goal",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    goalType: goalTypeEnum("goal_type").default("WEIGHT_MAINTENANCE").notNull(),
    goalRate: goalRateEnum("goal_rate").default("MODERATE").notNull(),
    startingWeight: decimal("starting_weight", {
      precision: 10,
      scale: 2,
    })
      .$type<number>()
      .notNull(),
    goalWeight: decimal("goal_weight", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    startDate: date("start_date", { mode: "date" }).notNull(),
    status: goalStatusEnum("status").notNull().default("IN_PROGRESS"),
  },
  (table) => ({
    uniqueInProgressGoal: uniqueIndex("unique_in_progress_goal")
      .on(table.userId, table.status)
      .where(sql`${table.status} = 'IN_PROGRESS'`),
  })
);

export const accountTable = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      uniqueProvider: unique("provider_unique").on(
        table.providerId,
        table.providerUserId
      ),
    };
  }
);

export const preferenceTable = pgTable("preference", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  lengthUnit: lengthUnitEnum("length_unit").notNull(),
  weightUnit: weightUnitEnum("weight_unit").notNull(),
});

export const userFavoriteFoodsTable = pgTable(
  "user_favorite_foods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    foodId: integer("food_id")
      .references(() => foodTable.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // Ensure user can't favorite same food twice
      uniqUserFood: uniqueIndex("uniq_user_food").on(
        table.userId,
        table.foodId
      ),
    };
  }
);

export const userRecentFoodsTable = pgTable(
  "user_recent_foods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    foodId: integer("food_id")
      .references(() => foodTable.id)
      .notNull(),
    lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
  },
  (table) => {
    return {
      // Ensure user can't have duplicate recent foods
      uniqUserFood: uniqueIndex("uniq_user_recent_food").on(
        table.userId,
        table.foodId
      ),
    };
  }
);

export type LengthUnits = typeof preferenceTable.$inferInsert.lengthUnit;
export type WeightUnits = typeof preferenceTable.$inferInsert.weightUnit;
export type NewUserFavoriteFood = typeof userFavoriteFoodsTable.$inferInsert;
export type NewUserRecentFood = typeof userRecentFoodsTable.$inferInsert;

export type GenderType = (typeof genderEnum.enumValues)[number];
export type LengthUnitType = (typeof lengthUnitEnum.enumValues)[number];
export type WeightUnitType = (typeof weightUnitEnum.enumValues)[number];
export type ActivityLevelType = (typeof activityLevelEnum.enumValues)[number];

export type PlanType = (typeof planEnum.enumValues)[number];
export type GoalType = (typeof goalTypeEnum.enumValues)[number];
export type GoalStatusType = (typeof goalStatusEnum.enumValues)[number];
export type GoalRateType = (typeof goalRateEnum.enumValues)[number];
// Configuration objects
export const Gender: Record<GenderType, { label: string; value: string }> = {
  MALE: { label: "Male", value: "MALE" },
  FEMALE: { label: "Female", value: "FEMALE" },
};

export const LengthUnit: Record<
  LengthUnitType,
  { label: string; value: string; conversion: number }
> = {
  CENTIMETER: { label: "cm", value: "CENTIMETER", conversion: 1 },
  INCH: { label: "in", value: "INCH", conversion: 2.54 }, // 1 inch = 2.54 cm
};

export const WeightUnit: Record<
  WeightUnitType,
  { label: string; value: string; conversion: number }
> = {
  KILOGRAM: { label: "kg", value: "KILOGRAM", conversion: 1 },
  POUND: { label: "lb", value: "POUND", conversion: 0.453592 }, // 1 lb = 0.453592 kg
};

export const ActivityLevel: Record<
  ActivityLevelType,
  { multiplier: number; description: string; value: string }
> = {
  SEDENTARY: {
    multiplier: 1.2,
    description: "Little or no exercise, desk job",
    value: "SEDENTARY",
  },
  LIGHTLY_ACTIVE: {
    multiplier: 1.375,
    description: "Light exercise 1-3 days/week",
    value: "LIGHTLY_ACTIVE",
  },
  MODERATELY_ACTIVE: {
    multiplier: 1.55,
    description: "Moderate exercise 3-5 days/week",
    value: "MODERATELY_ACTIVE",
  },
  VERY_ACTIVE: {
    multiplier: 1.725,
    description: "Heavy exercise 6-7 days/week",
    value: "VERY_ACTIVE",
  },
  EXTREMELY_ACTIVE: {
    multiplier: 1.9,
    description: "Very heavy exercise, physical job or training twice per day",
    value: "EXTREMELY_ACTIVE",
  },
};

export const Plan: Record<PlanType, { label: string; value: string }> = {
  PREMIUM: { label: "Premium", value: "PREMIUM" },
  FREE: { label: "Free", value: "FREE" },
};

export const Goal: Record<GoalType, { label: string; value: string }> = {
  WEIGHT_LOSS: { label: "Weight Loss", value: "WEIGHT_LOSS" },
  MUSCLE_GAIN: { label: "Muscle Gain", value: "MUSCLE_GAIN" },
  WEIGHT_MAINTENANCE: {
    label: "Weight Maintenance",
    value: "WEIGHT_MAINTENANCE",
  },
};

export const GoalStatus: Record<
  GoalStatusType,
  { label: string; value: string }
> = {
  IN_PROGRESS: { label: "In Progress", value: "IN_PROGRESS" },
  COMPLETED: { label: "Completed", value: "COMPLETED" },
  ABANDONED: { label: "Abandoned", value: "ABANDONED" },
};

export const GoalRate: Record<
  GoalRateType,
  {
    label: string;
    value: string;
    percentage: number;
    weightLossPerWeek: {
      kg: number;
      lb: number;
      description: string;
    };
    weightGainPerWeek: {
      kg: number;
      lb: number;
      description: string;
    };
    calorieAdjustment: {
      deficit: number;
      surplus: number;
    };
  }
> = {
  SLOW: {
    label: "Slow",
    value: "SLOW",
    percentage: 10,
    weightLossPerWeek: {
      kg: 0.25,
      lb: 0.55,
      description:
        "Gradual, sustainable weight loss at 0.25 kg (0.55 lb) per week",
    },
    weightGainPerWeek: {
      kg: 0.125,
      lb: 0.275,
      description:
        "Lean muscle gain with minimal fat at 0.125 kg (0.275 lb) per week",
    },
    calorieAdjustment: {
      deficit: 250, // 250 calorie deficit per day
      surplus: 125, // 125 calorie surplus per day
    },
  },
  MODERATE: {
    label: "Moderate",
    value: "MODERATE",
    percentage: 20,
    weightLossPerWeek: {
      kg: 0.5,
      lb: 1.1,
      description:
        "Standard recommended weight loss at 0.5 kg (1.1 lb) per week",
    },
    weightGainPerWeek: {
      kg: 0.25,
      lb: 0.55,
      description: "Balanced muscle gain at 0.25 kg (0.55 lb) per week",
    },
    calorieAdjustment: {
      deficit: 500, // 500 calorie deficit per day
      surplus: 250, // 250 calorie surplus per day
    },
  },
  AGGRESSIVE: {
    label: "Aggressive",
    value: "AGGRESSIVE",
    percentage: 30,
    weightLossPerWeek: {
      kg: 0.75,
      lb: 1.65,
      description:
        "Maximum recommended weight loss at 0.75 kg (1.65 lb) per week",
    },
    weightGainPerWeek: {
      kg: 0.5,
      lb: 1.1,
      description:
        "Maximum recommended muscle gain at 0.5 kg (1.1 lb) per week",
    },
    calorieAdjustment: {
      deficit: 750, // 750 calorie deficit per day
      surplus: 500, // 500 calorie surplus per day
    },
  },
};
