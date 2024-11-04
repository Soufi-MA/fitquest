import {
  ActivityLevel,
  ActivityLevelType,
  Gender,
  GenderType,
  Goal,
  GoalRate,
  GoalRateType,
  GoalType,
  LengthUnit,
  LengthUnitType,
  WeightUnit,
  WeightUnitType,
} from "@/db/schema/user";
import { z } from "zod";

export const onboadingStep1 = z.object({
  name: z.string().min(3),
  gender: z.enum(Object.keys(Gender) as [GenderType]),
  birthDay: z.date().max(new Date()),
});

export type OnboadingStep1 = z.infer<typeof onboadingStep1>;

export const onboadingStep2 = z.object({
  lengthUnit: z.enum(Object.keys(LengthUnit) as [LengthUnitType]),
  weightUnit: z.enum(Object.keys(WeightUnit) as [WeightUnitType]),
  height: z
    .number()
    .min(100, "Minimum height exceeded")
    .max(300, "Maximum height exceeded"),
  weight: z
    .number()
    .min(30, "Minimum weight exceeded")
    .max(300, "Maximum weight exceeded"),
});

export type OnboadingStep2 = z.infer<typeof onboadingStep2>;

export const onboadingStep3 = z.object({
  goalType: z.enum(Object.keys(Goal) as [GoalType]),
  goalWeight: z.number().nullish(),
  goalRate: z.enum(Object.keys(GoalRate) as [GoalRateType]),
  activityLevel: z.enum(Object.keys(ActivityLevel) as [ActivityLevelType]),
});

export type OnboadingStep3 = z.infer<typeof onboadingStep3>;

export const updateUserValidator = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(Object.keys(Gender) as [GenderType]),
  height: z
    .number()
    .min(100, "Minimum height exceeded")
    .max(300, "Maximum height exceeded"),
  heightUnit: z.enum(Object.keys(LengthUnit) as [LengthUnitType]),
  weight: z
    .number()
    .min(30, "Minimum weight exceeded")
    .max(300, "Maximum weight exceeded"),
  weightUnit: z.enum(Object.keys(WeightUnit) as [WeightUnitType]),
  birthDay: z.date(),
});
export type UpdateUserValidator = z.infer<typeof updateUserValidator>;
