import React from "react";
import { ModeToggle } from "./toggle";
import { Bell, LogOut, Mail, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PROFILE_TABS } from "@/config";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { getCurrentUser, logout } from "@/lib/session";
import { PopoverClose } from "@radix-ui/react-popover";

const UserNav = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-12 rounded-full bg-muted p-0"
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
          <PopoverClose asChild>
            <Link
              href={"/dashboard/profile/notifications"}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md p-4 hover:bg-muted"
            >
              View all notifications
            </Link>
          </PopoverClose>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-12 rounded-full bg-muted p-0"
          )}
        >
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
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
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="prifile"
                height={48}
                width={48}
                className="rounded-full object-cover"
              />
            ) : (
              <User />
            )}
            <div className="flex flex-col gap-1">
              <p>{user.name}</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 px-2">
            {PROFILE_TABS.map((item) => (
              <PopoverClose key={item.id} asChild>
                <Link
                  className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md px-4 hover:bg-muted"
                  href={item.href}
                >
                  <item.icon size={20} />
                  <p>{item.label}</p>
                </Link>
              </PopoverClose>
            ))}
          </div>
          <Separator />
          <form action={logout} className="flex flex-col gap-2 px-2">
            <PopoverClose asChild>
              <Button
                type="submit"
                variant={"ghost"}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-md px-4"
              >
                <LogOut size={20} />
                <p>Log Out</p>
              </Button>
            </PopoverClose>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserNav;
