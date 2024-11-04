import React, { type ReactNode } from "react";
import Navigation from "../../components/Navigation";
import Navbar from "../../components/Navbar";
import UserNav from "@/components/UserNav";
import { getCurrentUser, getUserOnboardingStatus } from "../actions";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const onBoardingStatus = await getUserOnboardingStatus(user.id);
  if (onBoardingStatus !== "COMPLETED") redirect("/onboarding");

  return (
    <Navigation>
      <Navbar>
        <UserNav />
      </Navbar>
      {children}
    </Navigation>
  );
};

export default DashboardLayout;
