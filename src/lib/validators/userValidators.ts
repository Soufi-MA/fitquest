import {
  Gender,
  GenderType,
  LengthUnit,
  LengthUnitType,
  WeightUnit,
  WeightUnitType,
} from "@/db/schema/user";
import { z } from "zod";

export const finishSetupValidator = z.object({
  name: z.string().min(3),
  gender: z.enum(Object.keys(Gender) as [GenderType]),
  birthDay: z.date().max(new Date()),
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

export type FinishSetupValidator = z.infer<typeof finishSetupValidator>;

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
