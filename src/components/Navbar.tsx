"use client";

import React, { ReactNode } from "react";

import { usePathname } from "next/navigation";
import { DASHBOARD_TABS, PROFILE_TABS } from "../config";

const Navbar = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:h-20 md:px-8">
      <p className="text-base font-semibold text-foreground md:text-3xl">
        {[...DASHBOARD_TABS, ...PROFILE_TABS].find(
          (tab) => tab.href === pathname
        )?.label ?? ""}
      </p>
      {children}
    </div>
  );
};

export default Navbar;
