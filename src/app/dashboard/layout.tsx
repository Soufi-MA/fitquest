import React, { type ReactNode } from "react";
import Navigation from "../../components/Navigation";
import Navbar from "../../components/Navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Navigation>
      <Navbar />
      {children}
    </Navigation>
  );
};

export default DashboardLayout;
