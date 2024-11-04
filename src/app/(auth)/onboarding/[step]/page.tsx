import { Progress } from "@/components/ui/progress";
import React from "react";
import OnboardingForm from "../_components/OnboardingForm";
import Image from "next/image";
import { getCurrentUser, getUserOnboardingStatus } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import { getUserPreference } from "@/app/dashboard/(tabs)/profile/_components/actions";

interface PageProps {
  params: Promise<{
    step: number;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { step } = await params;
  if (step != 1 && step != 2 && step != 3) return notFound();

  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const onBoardingStatus = await getUserOnboardingStatus();
  const userPreferences = await getUserPreference();

  if (onBoardingStatus === "PENDING" && step > 1) {
    redirect("/onboarding/1");
  } else if (onBoardingStatus === "METRICS_INCOMPLETE" && step > 2) {
    redirect("/onboarding/2");
  } else if (onBoardingStatus === "GOAL_INCOMPLETE" && step > 3) {
    redirect("/onboarding/3");
  }

  return (
    <div className="my-auto box-border flex w-[90vw] max-w-[600px] flex-col gap-4 items-center justify-center rounded-xl bg-muted p-4 shadow-lg">
      <Progress
        value={step == 1 ? 33 : step == 2 ? 66 : 100}
        className="w-full"
      />
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Image src={"/logo.png"} alt="" height={48} width={48} />
        <h2 className="my-3 text-center text-xl font-bold">
          Welcome to FitQuest
        </h2>
        <p>Let personalize your journey</p>
      </div>
      <OnboardingForm
        step={step}
        user={user}
        userPreference={userPreferences}
      />
    </div>
  );
};

export default page;
