"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, ArrowUp, ArrowDown, Send, Plus } from "lucide-react";
import { useState } from "react";

export default function HomeSection() {
  const [hideBalance, setHideBalance] = useState(false);

  const walletBalance = "₦124,520";
  const walletAddress = "0xF3A4...8B9D";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full text-white px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 min-h-screen flex flex-col space-y-6"
    >
      {/* Greeting always visible */}
      <div className="flex flex-col items-start">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Good evening, Jesse 👋
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-1">Your savings wallet</p>
      </div>

      {/* Wallet Balance */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-[#1c1c1e]/80 px-6 py-6 rounded-xl text-center font-extrabold text-4xl sm:text-5xl md:text-6xl flex items-center justify-center gap-3 w-full max-w-md">
          <span>{hideBalance ? "••••••" : walletBalance}</span>
          <button onClick={() => setHideBalance(!hideBalance)}>
            {hideBalance ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center gap-2 bg-[#151b2a]/80 px-4 py-2 rounded-lg w-full sm:w-auto justify-center">
          <span className="text-sm font-mono">{walletAddress}</span>
          <button className="ml-2 text-gray-400 hover:text-white transition">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <section className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition text-lg sm:text-xl">
          <ArrowUp size={20} /> Add Money
        </button>
        <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition text-lg sm:text-xl">
          <ArrowDown size={20} /> Withdraw
        </button>
        <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition text-lg sm:text-xl">
          <Send size={20} /> Send
        </button>
      </section>

      {/* Recent Transactions */}
<section className="bg-[#151b2a]/80 rounded-xl p-5 sm:p-6 md:p-8 space-y-4 w-full max-w-4xl mx-auto">
  <h4 className="font-semibold mb-2 text-lg sm:text-xl">Recent Activity</h4>
  <div className="space-y-3">
    {[
      { type: "Deposit", time: "Today • 12:04", amount: "+₦10,000", color: "text-green-400" },
      { type: "Withdrawal", time: "Yesterday • 19:12", amount: "-₦4,500", color: "text-red-400" },
      { type: "Transfer", time: "2 days ago • 10:45", amount: "-₦2,000", color: "text-yellow-400" },
    ].map((t) => (
      <div
        key={t.type + t.time}
        className="flex flex-row flex-wrap items-center justify-between gap-2 bg-white/5 hover:bg-white/10 p-4 sm:p-5 rounded-xl transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="text-base sm:text-lg font-medium">{t.type}</p>
          <p className="text-xs sm:text-sm text-gray-400">{t.time}</p>
        </div>
        <p className={`font-semibold text-lg sm:text-2xl ${t.color}`}>{t.amount}</p>
      </div>
    ))}
  </div>
</section>

{/* Savings Goals */}
<section className="space-y-4 w-full max-w-4xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <h3 className="text-lg sm:text-2xl font-semibold">Active Savings Goals</h3>
    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-sm sm:text-base font-medium transition">
      <Plus size={16} /> Create Goal
    </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { name: "Emergency Fund", progress: 0.65 },
      { name: "Vacation Fund", progress: 0.42 },
      { name: "New Laptop", progress: 0.8 },
    ].map((goal) => (
      <div
        key={goal.name}
        className="p-6 sm:p-5 md:p-6 bg-[#151b2a]/80 rounded-xl flex flex-col justify-between hover:bg-[#1c2338] transition min-h-[140px]"
      >
        <h4 className="font-semibold text-base sm:text-lg">{goal.name}</h4>
        <div className="w-full bg-white/10 h-3 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-3 rounded-full transition-all"
            style={{ width: `${goal.progress * 100}%` }}
          ></div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm sm:text-base font-medium transition">
          Add Money
        </button>
      </div>
    ))}
  </div>
</section>


    </motion.div>
  );
}
