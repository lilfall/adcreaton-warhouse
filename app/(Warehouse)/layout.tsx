import MainNav from "@/components/layout/main-nav";
import Sidebar from "@/components/layout/sidebar";

import { Metadata } from "next";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const metadata: Metadata = {
  title: "Admin Panel",
  description: "dashboard",
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex bg-foreground">
      <Sidebar />
      <div className="flex-1 w-full">
        <MainNav />
        <div className="rounded-tl-2xl bg-background p-4 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
