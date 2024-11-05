import { getUserOnboardingStatus, logout } from "@/app/actions";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

const OnboardingLayout = async ({ children }: { children: ReactNode }) => {
  const onBoardingStatus = await getUserOnboardingStatus();
  if (onBoardingStatus === "COMPLETED") redirect("/dashboard");

  return (
    <div className="relative flex h-[90vh] flex-col items-center">
      <div className="flex justify-center md:justify-end items-center w-full py-4 px-2 z-20">
        <ModeToggle />
        <form action={logout} className="flex flex-col items-center gap-2 px-2">
          <Button
            type="submit"
            variant={"ghost"}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-md px-4"
          >
            <LogOut size={20} />
            <p>Log Out</p>
          </Button>
        </form>
      </div>
      {children}
    </div>
  );
};

export default OnboardingLayout;
