"use client";

import Image from "next/image";
import React, { useState } from "react";
import localFont from "next/font/local";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { Loader2, LogOut, Pin, PinOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { DASHBOARD_TABS, PROFILE_TABS } from "../../config";
import { Separator } from "~/components/ui/separator";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const helveticaRounded = localFont({
  src: "../../../public/fonts/helvetica/helvetica-rounded-bold.woff",
});

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(true);
  const router = useRouter();
  const [isLoading, setIsloading] = useState<boolean>(false);

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
    <div
      onMouseEnter={() => {
        setCollapsed(false);
      }}
      onMouseLeave={() => {
        setCollapsed(pinned ? false : true);
      }}
      className={cn(
        "fixed bottom-0 flex w-full select-none flex-col justify-between overflow-hidden bg-muted transition-all ease-in-out max-md:border-t md:sticky md:top-0 md:h-screen md:w-[265px] md:duration-300",
        { "md:w-20": collapsed },
      )}
    >
      <div>
        <div
          className={cn(
            "relative flex h-20 w-full items-center justify-between border-b px-6 transition-all max-md:hidden",
          )}
        >
          <div
            className={cn("flex items-center gap-2 md:duration-300", {
              "gap-0": collapsed,
            })}
          >
            <Image src={"/logo.png"} alt="logo" height={32} width={32} />
            <p
              className={cn(
                "text-2xl text-foreground md:duration-150",
                { "text-muted": collapsed },
                helveticaRounded.className,
              )}
            >
              <span
                className={cn("text-primary md:duration-150", {
                  "text-muted": collapsed,
                })}
              >
                Fit
              </span>
              Quest
            </p>
          </div>
          {pinned ? (
            <PinOff
              onClick={() => setPinned(false)}
              size={26}
              className={cn(
                "cursor-pointer rounded-full border border-muted-foreground p-1 text-muted",
                {
                  hidden: collapsed,
                  "text-muted-foreground": !collapsed,
                },
              )}
            />
          ) : (
            <Pin
              onClick={() => setPinned(true)}
              size={26}
              className={cn(
                "rounded-full border border-muted-foreground p-1 text-muted",
                {
                  hidden: collapsed,
                  "text-muted-foreground": !collapsed,
                },
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-5 items-start gap-1 p-2 text-muted-foreground max-md:h-20 md:flex md:flex-col md:px-3.5 md:py-2">
          {DASHBOARD_TABS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 overflow-x-hidden rounded-md px-4 max-md:h-16 md:h-10 md:max-h-16 md:flex-row md:justify-start md:gap-2 md:rounded md:duration-300",
                {
                  "bg-primary text-primary-foreground md:drop-shadow-primary":
                    pathname === item.href,
                  "md:hover:bg-foreground/10 md:hover:text-foreground":
                    pathname !== item.href,
                  "md:gap-0": collapsed,
                },
              )}
            >
              <item.icon className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
              <p
                className={cn(
                  "text-xs xs:text-sm sm:text-base md:duration-300",
                  {
                    "md:text-muted": collapsed && pathname !== item.href,
                    "md:text-primary": collapsed && pathname === item.href,
                  },
                )}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>
        <Separator className="max-md:hidden" />
        <div className="flex flex-col items-start gap-1 p-2 px-3.5 py-2 text-muted-foreground max-md:hidden">
          {PROFILE_TABS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 overflow-x-hidden rounded-md px-4 max-md:h-16 md:h-10 md:max-h-16 md:flex-row md:justify-start md:gap-2 md:rounded md:duration-300",
                {
                  "bg-primary text-primary-foreground md:drop-shadow-primary":
                    pathname === item.href,
                  "md:hover:bg-foreground/10 md:hover:text-foreground":
                    pathname !== item.href,
                  "md:gap-0": collapsed,
                },
              )}
            >
              <item.icon className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
              <p
                className={cn(
                  "text-nowrap text-xs xs:text-sm sm:text-base md:duration-300",
                  {
                    "md:text-muted": collapsed && pathname !== item.href,
                    "md:text-primary": collapsed && pathname === item.href,
                  },
                )}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 py-2 text-muted-foreground max-md:hidden">
        <Separator />
        <div className="px-3.5">
          <div
            onClick={() => signOutHandler()}
            className="flex h-10 w-full cursor-pointer items-center justify-start gap-2 overflow-x-hidden rounded px-4 duration-300 hover:bg-foreground/10 hover:text-foreground"
          >
            <LogOut className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
            <p
              className={cn(
                "text-nowrap text-xs xs:text-sm sm:text-base md:duration-300",
                {
                  "md:text-muted": collapsed,
                },
              )}
            >
              Log Out
            </p>
            {isLoading && <Loader2 className="animate-spin" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
