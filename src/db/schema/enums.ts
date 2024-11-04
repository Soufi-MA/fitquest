import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);

export const lengthUnitEnum = pgEnum("length_unit", ["CENTIMETER", "INCH"]);

export const weightUnitEnum = pgEnum("weight_unit", ["KILOGRAM", "POUND"]);

export const planEnum = pgEnum("plan", ["PREMIUM", "FREE"]);

export const goalTypeEnum = pgEnum("goal_type", [
  "WEIGHT_LOSS",
  "MUSCLE_GAIN",
  "WEIGHT_MAINTENANCE",
]);

export const goalStatusEnum = pgEnum("goal_status", [
  "IN_PROGRESS",
  "COMPLETED",
  "ABANDONED",
]);

export const goalRateEnum = pgEnum("goal_rate", [
  "SLOW",
  "MODERATE",
  "AGGRESSIVE",
]);
export const activityLevelEnum = pgEnum("activity_level", [
  "SEDENTARY",
  "LIGHTLY_ACTIVE",
  "MODERATELY_ACTIVE",
  "VERY_ACTIVE",
  "EXTREMELY_ACTIVE",
]);
export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "PENDING",
  "METRICS_INCOMPLETE",
  "GOAL_INCOMPLETE",
  "COMPLETED",
]);
