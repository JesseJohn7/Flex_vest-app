"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Clock, PiggyBank, User } from "lucide-react";

const navItems = [
  { id: "home", name: "Home", icon: Home },
  { id: "history", name: "History", icon: Clock },
  { id: "savings", name: "Savings", icon: PiggyBank },
  { id: "profile", name: "Profile", icon: User },
];

export default function Sidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (s: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 76 }}
        animate={{ width: 76 }}
        className="hidden sm:flex fixed left-0 top-0 bottom-0 bg-[#101010] shadow-lg z-40 flex-col items-center py-6 border-r border-white/5"
      >
        {/* Logo */}
        <div className="w-full mb-10 flex flex-col items-center">
          <h1 className="text-[14px] font-semibold tracking-wide leading-none">
            <span className="text-green-500">Flex</span>
            <span className="text-white">Vest</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActive(item.id)}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? "bg-green-600/20 text-green-400"
                      : "hover:bg-green-500/20 text-gray-400 hover:text-green-400"
                  }`}
                >
                  <Icon size={20} />
                </button>

                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 bg-[#2a2a2a]/90 text-white text-xs rounded-md px-3 py-1 shadow-md whitespace-nowrap pointer-events-none backdrop-blur-sm">
                  {item.name}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto mb-2 text-[10px] text-gray-500">v1.0 • UI</div>
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-md border-b border-white/10 px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-wide">
          <span className="text-green-500">Flex</span>
          <span className="text-white">Vest</span>
        </h1>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2.5 rounded-md bg-white/5 hover:bg-white/10 text-white transition border border-white/10"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-[240px] bg-[#121212]/95 backdrop-blur-md border-r border-white/10 shadow-xl z-50 flex flex-col py-8 px-6"
            >
              {/* Logo inside Drawer */}
              <div className="mb-10">
                <h1 className="text-lg font-semibold tracking-wide">
                  <span className="text-green-500">Flex</span>
                  <span className="text-white">Vest</span>
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors duration-200 ${
                        isActive
                          ? "bg-green-600/20 text-green-400"
                          : "text-gray-400 hover:text-green-400 hover:bg-green-500/20"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
