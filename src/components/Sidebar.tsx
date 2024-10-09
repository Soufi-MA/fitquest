"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Pin, PinOff } from "lucide-react";
import { usePathname } from "next/navigation";
import { DASHBOARD_TABS, PROFILE_TABS } from "../config";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { logout } from "@/lib/session";
import { Button } from "./ui/button";

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(true);
  const isBreakPoint = useMediaQuery(920);

  useEffect(() => {
    setCollapsed(isBreakPoint);
  }, [isBreakPoint]);

  return (
    <div
      onMouseEnter={() => {
        !isBreakPoint && setCollapsed(false);
      }}
      onMouseLeave={() => {
        !isBreakPoint && setCollapsed(pinned ? false : true);
      }}
      className={cn(
        "fixed bottom-0 flex w-full select-none flex-col justify-between overflow-hidden bg-muted transition-all ease-in-out max-md:border-t md:sticky md:top-0 md:h-screen md:w-[265px] md:border-r md:duration-300",
        { "md:w-20": collapsed }
      )}
    >
      <div>
        <div
          className={cn(
            "relative flex h-20 w-full items-center justify-between border-b px-6 transition-all max-md:hidden"
          )}
        >
          <div
            className={cn("flex items-center gap-2 md:duration-300", {
              "gap-0": collapsed,
            })}
          >
            <Image src={"/logo.png"} alt="logo" height={32} width={32} />
            <p
              className={cn("text-2xl text-foreground md:duration-150", {
                "text-muted": collapsed,
              })}
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
                }
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
                }
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
                "group flex w-full flex-col items-center justify-center gap-1 overflow-x-hidden rounded-md px-4 max-md:h-16 md:h-10 md:max-h-16 md:flex-row md:justify-start md:gap-2 md:rounded md:duration-300",
                {
                  "bg-primary text-primary-foreground md:drop-shadow-primary":
                    pathname === item.href,
                  "md:hover:bg-foreground/10 md:hover:text-foreground":
                    pathname !== item.href,
                  "md:gap-0": collapsed,
                }
              )}
            >
              <item.icon className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
              <p
                className={cn(
                  "text-xs xs:text-sm sm:text-base md:duration-300",
                  {
                    "md:text-transparent md:group-hover:text-transparent":
                      collapsed,
                  }
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
                }
              )}
            >
              <item.icon className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
              <p
                className={cn(
                  "text-nowrap text-xs xs:text-sm sm:text-base md:duration-300",
                  {
                    "md:text-transparent md:group-hover:text-transparent":
                      collapsed,
                  }
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
        <form action={logout} className="px-3.5">
          <Button
            type="submit"
            variant={"ghost"}
            className="flex h-10 w-full cursor-pointer items-center justify-start gap-2 overflow-x-hidden rounded px-4 duration-300 hover:bg-foreground/10 hover:text-foreground"
          >
            <LogOut className="h-full max-h-6 w-full min-w-5 max-w-6 md:h-5 md:w-5" />
            <p
              className={cn(
                "text-nowrap text-xs xs:text-sm sm:text-base md:duration-300",
                {
                  "md:text-muted": collapsed,
                }
              )}
            >
              Log Out
            </p>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
