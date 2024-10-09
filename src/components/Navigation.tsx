import React, { type ReactNode } from "react";
import Sidebar from "./Sidebar";

const Navigation = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:flex-row-reverse md:pb-0">
      <span className="absolute bg-[conic-gradient(var(--tw-gradient-stops))] from-primary to-background top-[calc(100vh/4)] w-[60%] h-[calc(100vh/2)] blur-[100px] -z-10 opacity-30 dark:opacity-25 left-0"></span>
      <div className="flex flex-grow flex-col">{children}</div>
      <Sidebar />
    </div>
  );
};

export default Navigation;
