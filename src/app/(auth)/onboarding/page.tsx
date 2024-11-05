import { getCurrentUser, getUserOnboardingStatus } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ClipboardList, Ruler, Target } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const { user } = await getCurrentUser();
  const onBoardingStatus = await getUserOnboardingStatus();

  return (
    <div className="fixed inset-0 bg-background backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <div className="relative bg-card border rounded-lg shadow-lg p-6 w-full max-w-lg space-y-6 animate-in fade-in-50 slide-in-from-bottom-10 my-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Welcome aboard, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Let's get you set up in just three easy steps.
          </p>
        </div>

        <Progress
          value={
            onBoardingStatus === "PENDING"
              ? 33 - 33 / 2
              : onBoardingStatus === "METRICS_INCOMPLETE"
              ? 66 - 33 / 2
              : 100 - 33 / 2
          }
          className="w-full"
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground",
                {
                  "bg-primary text-primary-foreground":
                    onBoardingStatus === "METRICS_INCOMPLETE" ||
                    onBoardingStatus === "GOAL_INCOMPLETE",
                }
              )}
            >
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Basic Info</h3>
            <p className="text-sm text-muted-foreground">
              Tell us about yourself
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground",
                {
                  "bg-primary text-primary-foreground":
                    onBoardingStatus === "GOAL_INCOMPLETE",
                }
              )}
            >
              <Ruler className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Current Stats</h3>
            <p className="text-sm text-muted-foreground">Your starting point</p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground",
                {
                  "bg-primary text-primary-foreground": false,
                }
              )}
            >
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Goals</h3>
            <p className="text-sm text-muted-foreground">
              What you aim to achieve
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            className={buttonVariants()}
            href={`/onboarding/${
              onBoardingStatus === "PENDING"
                ? 1
                : onBoardingStatus === "METRICS_INCOMPLETE"
                ? 2
                : 3
            }`}
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
