"use server";

import { getCurrentUser } from "@/lib/session";
import { FinishSetupValidator } from "@/lib/validators/userValidators";

export const finishSetup = async (data: FinishSetupValidator) => {
  const user = await getCurrentUser();
  if (!user) return { unauthorized: true };

  return "ok";
};
