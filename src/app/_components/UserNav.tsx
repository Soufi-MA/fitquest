"use client";

import React, { useState } from "react";
import { ModeToggle } from "./toggle";
import { buttonVariants } from "~/components/ui/button";
import { Bell, Loader2, LogOut, Mail, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { USER_NAVIGATION } from "~/config";
import Link from "next/link";
import { PopoverClose } from "@radix-ui/react-popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PROFILE_TABS } from "~/config";

const UserNav = () => {
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
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-12 rounded-full bg-muted p-0",
          )}
        >
          <Bell />
        </PopoverTrigger>
        <PopoverContent
          className="mx-0 flex flex-col p-0"
          align="end"
          sideOffset={8}
        >
          <div className="flex justify-between px-4 py-4">
            <p>Notifications</p>
            <Mail />
          </div>
          <Separator />
          <ScrollArea className="h-[300px]">
            <div className="h-[400px]"></div>
          </ScrollArea>
          <Separator />

          <Link
            href={"/dashboard/notifications"}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md p-4 hover:bg-muted"
          >
            View all notifications
          </Link>
        </PopoverContent>
      </Popover>
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
            {PROFILE_TABS.map((item) => (
              <Link href={item.href} key={item.id}>
                <PopoverClose className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md px-4 hover:bg-muted">
                  <item.icon size={20} />
                  <p>{item.label}</p>
                </PopoverClose>
              </Link>
            ))}
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

export default UserNav;
