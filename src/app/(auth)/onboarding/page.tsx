import Image from "next/image";
import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import OnboardingNav from "./_components/OnboardingNav";
import { ModeToggle } from "@/components/toggle";
import { getCurrentUser, getUserOnboardingStatus } from "@/app/actions";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const onBoardingStatus = await getUserOnboardingStatus(user.id);
  if (onBoardingStatus === "COMPLETED") redirect("/dashboard");

  return (
    <div className="relative flex h-[90vh] flex-col items-center">
      <OnboardingNav />
      <div className="flex justify-end w-full py-4 px-2">
        <ModeToggle />
      </div>

      <div className="my-auto box-border flex w-[90vw] max-w-[600px] flex-col items-center justify-center rounded-xl bg-muted p-4 shadow-lg">
        <div className="flex flex-col items-center justify-center py-4">
          <Image src={"/logo.png"} alt="" height={48} width={48} />
          <h2 className="my-3 text-center text-xl font-bold">
            Welcome to FitQuest
          </h2>
          <p>Let personalize your journey</p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
};

export default page;
