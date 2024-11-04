import { getUserOnboardingStatus } from "@/app/actions";
import { ModeToggle } from "@/components/toggle";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

const OnboardingLayout = async ({ children }: { children: ReactNode }) => {
  const onBoardingStatus = await getUserOnboardingStatus();
  if (onBoardingStatus === "COMPLETED") redirect("/dashboard");

  return (
    <div className="relative flex h-[90vh] flex-col items-center">
      <div className="flex justify-end w-full py-4 px-2">
        <ModeToggle />
      </div>
      {children}
    </div>
  );
};

export default OnboardingLayout;
