import { z } from "zod";

export const FinishSetupValidator = z.object({
  gender: z.enum(["Male", "Female", "Other"]),
  birthDay: z.date().max(new Date()),
  lengthUnit: z.enum(["cm", "ft"]),
  weightUnit: z.enum(["kg", "lb"]),
  height: z.number().min(1),
  weight: z.number().min(1),
});

export type TFinishSetupValidator = z.infer<typeof FinishSetupValidator>;

export const AccountDetailsValidator = z.object({
  name: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  birthDay: z.date().max(new Date()),
  lengthUnit: z.enum(["cm", "ft"]),
  weightUnit: z.enum(["kg", "lb"]),
  height: z.number().min(1),
  weight: z.number().min(1),
});

export type TAccountDetailsValidator = z.infer<typeof AccountDetailsValidator>;

export const updateUserValidator = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["Male", "Female"]),
  height: z
    .number()
    .min(100, "Minimum height exceeded")
    .max(300, "Maximum height exceeded"),
  heightUnit: z.enum(["cm", "in"]),
  weight: z
    .number()
    .min(30, "Minimum weight exceeded")
    .max(300, "Maximum weight exceeded"),
  weightUnit: z.enum(["kg", "lb"]),
  birthDay: z.date(),
});
export type TUpdateUserValidator = z.infer<typeof updateUserValidator>;
