"use client";

import Sidebar from "./Sidebar";
import React from "react";

// Define the exact union type for your sections
export type DashboardSection = "home" | "history" | "savings" | "profile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  active: DashboardSection;
  setActive: React.Dispatch<React.SetStateAction<DashboardSection>>;
}

export default function DashboardLayout({
  children,
  active,
  setActive,
}: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col sm:flex-row bg-[#0b0b0b] text-white">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main
        className="
          flex-1
          w-full
          sm:ml-[76px]
          p-4 sm:p-6 md:p-8
          overflow-x-hidden overflow-y-auto
          transition-all duration-300
        "
      >
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
