"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Send } from "lucide-react";

export default function HistorySection() {
  const transactions = [
    {
      id: 1,
      title: "Deposit from Bank",
      date: "Nov 12, 2025 • 10:22",
      amount: "+₦10,000",
      type: "deposit",
    },
    {
      id: 2,
      title: "Withdrawal to Bank",
      date: "Nov 10, 2025 • 09:10",
      amount: "-₦5,000",
      type: "withdrawal",
    },
    {
      id: 3,
      title: "Send to @jane.doe",
      date: "Nov 09, 2025 • 08:21",
      amount: "-₦2,300",
      type: "transfer",
    },
    {
      id: 4,
      title: "Airtime Purchase",
      date: "Nov 06, 2025 • 15:40",
      amount: "-₦1,000",
      type: "airtime",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="text-green-400 w-5 h-5" />;
      case "withdrawal":
        return <ArrowUpRight className="text-red-400 w-5 h-5" />;
      case "transfer":
        return <Send className="text-blue-400 w-5 h-5" />;
      case "airtime":
        return <Send className="text-yellow-400 w-5 h-5" />;
      default:
        return <Send className="text-gray-400 w-5 h-5" />;
    }
  };

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
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-white/10 p-2 rounded-full">
                {getIcon(tx.type)}
              </div>
              <div className="flex flex-col">
                <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">
                  {tx.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  {tx.date}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <span
              className={`text-sm sm:text-base font-semibold ${
                tx.amount.startsWith("+")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
