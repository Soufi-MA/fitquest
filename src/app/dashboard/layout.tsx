import React, { type ReactNode } from "react";
import Navigation from "../../components/Navigation";
import Navbar from "../../components/Navbar";
import UserNav from "@/components/UserNav";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Navigation>
      <Navbar>
        <UserNav />
      </Navbar>
      {children}
    </Navigation>
  );
};

export default DashboardLayout;
