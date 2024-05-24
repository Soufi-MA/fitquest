"use client";

import { Loader2, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "~/app/_components/toggle";
import { buttonVariants } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const OnboardingNav = () => {
  const router = useRouter();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { data: session } = useSession();
  if (!session) return;

  const signOutHandler = async () => {
    setIsloading(true);
    const data = await signOut({ redirect: false, callbackUrl: "/sign-in" });

    setIsloading(false);
    if (data.url) {
      toast.success("Signed out successfully");
      router.replace(data.url);
    }
  };
  return (
    <div className="flex w-full justify-end gap-2 p-4">
      <ModeToggle />
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-12 rounded-full bg-muted p-0",
          )}
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="prifile"
              height={48}
              width={48}
              className="rounded-full object-cover"
            />
          ) : (
            <User />
          )}
        </PopoverTrigger>
        <PopoverContent
          className="mx-0 flex flex-col gap-2 px-0 pb-2"
          align="end"
          sideOffset={8}
        >
          <div className="flex gap-2 px-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="prifile"
                height={48}
                width={48}
                className="rounded-full object-cover"
              />
            ) : (
              <User />
            )}
            <div className="flex flex-col gap-1">
              <p>{session.user.name}</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 px-2">
            <div
              onClick={() => signOutHandler()}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-md px-4 hover:bg-muted"
            >
              <LogOut size={20} />
              <p>Log Out</p>
              {isLoading && <Loader2 className="animate-spin" />}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OnboardingNav;
