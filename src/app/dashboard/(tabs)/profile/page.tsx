import React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import AccountDetailsForm from "./_components/AccountDetailsForm";
import { api } from "~/trpc/server";

const page = async () => {
  const user = await api.users.getUser();
  if (!user) return "loading user";
  return (
    <div className="flex flex-col rounded-md bg-muted py-4 shadow-md">
      <div className="flex flex-col px-8 pb-4">
        <p className="text-2xl font-semibold">Account Details</p>
        <p className="text-muted-foreground">Manage your FitQuest account</p>
      </div>
      <Separator />
      <AccountDetailsForm user={user} />
      <Separator />
      <div className="flex flex-col gap-4 px-8 pt-4">
        <p className="text-2xl font-semibold">Delete Account</p>
        <div className="rounded-md bg-destructive/20 p-4 text-foreground">
          <p>Are you sure you want to delete your account?</p>
          <p className="text-sm">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground"
            id="delete"
          />
          <label
            htmlFor="delete"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm my account deactivation
          </label>
        </div>
        <div>
          <Button disabled variant={"destructive"}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
