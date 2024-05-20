"use client";

import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";

const Navigation = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:flex-row-reverse md:pb-0">
      <div className="flex flex-grow flex-col bg-gradient-to-r">{children}</div>
      <Sidebar />
    </div>
  );
};

export default Navigation;
