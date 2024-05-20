"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      suppressHydrationWarning
      className="flex h-12 w-24 items-center justify-between rounded-full bg-muted p-1 transition-all"
    >
      <Button
        onClick={() => theme != "dark" && setTheme("dark")}
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full border-0 bg-muted text-muted-foreground dark:bg-background dark:text-foreground"
      >
        <Moon />
      </Button>
      <Button
        onClick={() => theme != "light" && setTheme("light")}
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full border-0 bg-background text-foreground dark:bg-muted dark:text-muted-foreground"
      >
        <Sun />
      </Button>
    </div>
  );
}
