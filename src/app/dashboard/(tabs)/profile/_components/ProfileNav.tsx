"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import { PROFILE_TABS } from "~/config";
import { cn } from "~/lib/utils";

const ProfileNav = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      {PROFILE_TABS.map((tab) => (
        <Link
          key={tab.id}
          className={cn(
            "flex items-center gap-1 max-md:w-full",
            buttonVariants({
              variant: pathname === tab.href ? "default" : "outline",
            }),
          )}
          href={tab.href}
        >
          <tab.icon size={16} />
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default ProfileNav;
