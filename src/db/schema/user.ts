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

export const GenderEnum = pgEnum("gender", ["Male", "Female", "Other"]);
export const LengthUnitEnum = pgEnum("length_unit", ["cm", "ft"]);
export const WeightUnitEnum = pgEnum("weight_unit", ["kg", "lb"]);
export const PlanEnum = pgEnum("plan", ["Premium", "Free"]);

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
  lengthUnit: LengthUnitEnum("length_unit").notNull(),
  weightUnit: WeightUnitEnum("weight_unit").notNull(),
});
