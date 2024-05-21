"use client";

import React from "react";

import { usePathname } from "next/navigation";
import { DASHBOARD_TABS, PROFILE_TABS } from "../../config";
import UserNav from "./UserNav";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 flex h-20 items-center justify-between border-b bg-background px-8">
      <p className="text-base font-semibold text-foreground md:text-3xl">
        {[...DASHBOARD_TABS, ...PROFILE_TABS].find(
          (tab) => tab.href === pathname,
        )?.label ?? ""}
      </p>
      <UserNav />
    </div>
  );
};

export default Navbar;
