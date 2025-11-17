"use client";

import { motion } from "framer-motion";

export default function ProfileSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-black font-bold text-lg sm:text-xl">
          J
        </div>
        <div>
          <div className="text-lg sm:text-xl font-semibold">Jesse John</div>
          <div className="text-xs sm:text-sm text-gray-400">
            jesse@example.com
          </div>
        </div>
      </div>

      {/* Account & Notifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
          <div className="text-sm sm:text-base text-gray-400">Account</div>
          <div className="mt-2 text-base sm:text-lg">Personal</div>
        </div>

        <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
          <div className="text-sm sm:text-base text-gray-400">Notifications</div>
          <div className="mt-2 text-base sm:text-lg">Enabled</div>
        </div>
      </div>
    </motion.div>
  );
}
