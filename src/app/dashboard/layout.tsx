import React, { type ReactNode } from "react";
import Navigation from "../_components/Navigation";
import Navbar from "../_components/Navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Navigation>
      <Navbar />
      {children}
    </Navigation>
  );
};

export default DashboardLayout;
