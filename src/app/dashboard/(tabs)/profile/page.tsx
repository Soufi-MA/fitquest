import React from "react";
import AccountDetailsForm from "./_components/AccountDetailsForm";
import { getCurrentUser } from "@/app/actions";
import { getUserPreference } from "./_components/actions";

const page = async () => {
  const { user } = await getCurrentUser();
  if (!user) return "loading user";
  const userPreference = await getUserPreference();
  return <AccountDetailsForm user={user} userPreference={userPreference} />;
};

export default page;
