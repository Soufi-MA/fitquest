"use server";

import { getCurrentUser } from "@/app/actions";
import { FinishSetupValidator } from "@/lib/validators/userValidators";

export const finishSetup = async (data: FinishSetupValidator) => {
  const user = await getCurrentUser();
  if (!user) return { unauthorized: true };

  return "ok";
};
