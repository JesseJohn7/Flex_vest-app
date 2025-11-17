"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
  active,
  setActive,
}: {
  children: React.ReactNode;
  active: string;
  setActive: (s: string) => void;
}) {
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
