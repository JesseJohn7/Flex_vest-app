"use client";

import DashboardLayout from "./components/DashboardLayout";
import HomeSection from "./components/HomeSection";
import HistorySection from "./components/HistorySection";
import SavingsSection from "./components/SavingsSection";
import ProfileSection from "./components/ProfileSection";
import { useState } from "react";

export default function DashboardPage() {
  const [active, setActive] = useState<"home" | "history" | "savings" | "profile">("home");

  const renderSection = () => {
    switch (active) {
      case "home":
        return <HomeSection />;
      case "history":
        return <HistorySection />;
      case "savings":
        return <SavingsSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout active={active} setActive={setActive}>
      {renderSection()}
    </DashboardLayout>
  );
}
