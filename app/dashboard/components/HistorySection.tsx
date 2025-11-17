"use client";

import { motion } from "framer-motion";

export default function HistorySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Transaction History
      </h2>

      {/* History List */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Single Transaction */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-medium">Deposit</span>
            <span className="text-xs sm:text-sm text-gray-400">
              12 Nov 2025 • 10:22
            </span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-green-400">
            +₦10,000
          </span>
        </div>

        {/* Single Transaction */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-medium">Transfer</span>
            <span className="text-xs sm:text-sm text-gray-400">
              09 Nov 2025 • 08:21
            </span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-red-400">
            -₦2,300
          </span>
        </div>

        {/* Example More Items */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-medium">Airtime Purchase</span>
            <span className="text-xs sm:text-sm text-gray-400">
              06 Nov 2025 • 15:40
            </span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-red-400">
            -₦1,000
          </span>
        </div>
      </div>
    </motion.div>
  );
}
