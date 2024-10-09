"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      suppressHydrationWarning
      className="flex h-12 w-24 items-center justify-between rounded-full bg-muted p-1 transition-all cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full border-0 bg-muted text-muted-foreground hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-background"
      >
        <Moon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full border-0 bg-background text-foreground hover:bg-background dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
      >
        <Sun />
      </Button>
    </div>
  );
}
