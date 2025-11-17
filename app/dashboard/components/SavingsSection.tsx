"use client";

import { motion } from "framer-motion";

export default function SavingsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
        Savings
      </h2>

      {/* Savings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Auto-save plan */}
        <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
          <div className="text-sm sm:text-base text-gray-400">Auto-save plan</div>
          <div className="mt-2 text-lg sm:text-xl font-semibold">₦ 21,000</div>
          <div className="mt-3 text-xs sm:text-sm text-gray-400">
            Next transfer in 3 days
          </div>
        </div>

        {/* Locked savings */}
        <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
          <div className="text-sm sm:text-base text-gray-400">Locked savings</div>
          <div className="mt-2 text-lg sm:text-xl font-semibold">₦ 18,000</div>
          <div className="mt-3 text-xs sm:text-sm text-gray-400">
            Matures in 29 days
          </div>
        </div>
      </div>
    </motion.div>
  );
}
