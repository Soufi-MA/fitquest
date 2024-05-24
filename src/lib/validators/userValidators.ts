import { X } from "lucide-react";
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
