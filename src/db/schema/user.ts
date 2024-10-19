import {
  timestamp,
  text,
  pgTableCreator,
  date,
  uuid,
  decimal,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const GenderEnum = pgEnum("gender", ["Male", "Female"]);
export const LengthUnitEnum = pgEnum("length_unit", ["cm", "in"]);
export const WeightUnitEnum = pgEnum("weight_unit", ["kg", "lb"]);
export const PlanEnum = pgEnum("plan", ["Premium", "Free"]);
export const GoalTypeEnum = pgEnum("goal_type", [
  "Weight Loss",
  "Muscle Gain",
  "Weight Maintenance",
]);
export const GoalStatusEnum = pgEnum("goal_status", [
  "InProgress",
  "Completed",
  "Abandoned",
]);
export const GoalRateEnum = pgEnum("goal_rate", [
  "Slow",
  "Moderate",
  "Aggressive",
]);

const createTable = pgTableCreator((name) => `fitquest_${name}`);

export const userTable = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "date",
  }),
  profilePicture: text("profile_picture"),
  gender: GenderEnum("gender").notNull(),
  birthDay: date("birth_day", {
    mode: "date",
  }).notNull(),
  height: decimal("height", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 })
    .$type<number>()
    .notNull(),
  plan: PlanEnum("plan").notNull().default("Free"),
});

export const goalTable = createTable("goal", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("id")
    .references(() => userTable.id)
    .notNull(),
  goalType: GoalTypeEnum("goal_type").default("Weight Maintenance").notNull(),
  goalRate: GoalRateEnum("goal_rate").default("Moderate").notNull(),
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
  status: GoalStatusEnum("status").notNull().default("InProgress"),
});

export const accountTable = createTable(
  "account",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
    };
  }
);

export const sessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const magicLinkTable = createTable("magicLink", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const preferenceTable = createTable("preference", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id)
    .notNull()
    .unique(),
  lengthUnit: LengthUnitEnum("length_unit").notNull(),
  weightUnit: WeightUnitEnum("weight_unit").notNull(),
});

export type LengthUnits = typeof preferenceTable.$inferInsert.lengthUnit;
export type WeightUnits = typeof preferenceTable.$inferInsert.weightUnit;
