"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  PiggyBank,
  Car,
  Plane,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Plus,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomeSection() {
  const [hideBalance, setHideBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Example wallet address
  const walletAddress = "0xA12bC3D4E5F6G7H8I9J0KL8F9D";

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  // Example goal percentages
  const goal1Amount = 8500;
  const goal1Total = 20000;
  const goal1Percent = Math.min((goal1Amount / goal1Total) * 100, 100);

  const goal2Amount = 1200;
  const goal2Total = 3000;
  const goal2Percent = Math.min((goal2Amount / goal2Total) * 100, 100);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark min-h-screen px-4 sm:px-6 py-8 md:px-10 font-display"
    >
      {/* Greeting */}
      <div className="flex flex-col gap-1 mb-6 text-center sm:text-left">
        <p className="text-gray-900 dark:text-white text-2xl sm:text-4xl font-black leading-snug tracking-[-0.03em] break-words whitespace-normal w-full block">
        <p className="text-gray-500 dark:text-[#9da9b8] text-base sm:text-lg font-medium leading-normal">
          Save Today.
        </p>
          Good Morning, Jesse 👋
        </p>
      </div>

      {/* Total Balance Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-white/10 relative">
        <div className="flex justify-between items-start flex-wrap gap-4">
          {/* Left Side: Balance Info */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-normal">
              Total Balance
            </p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
                {hideBalance ? "••••••" : "$12,450.78"}
              </p>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition"
              >
                {hideBalance ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                in USDC
              </p>
              <p className="text-green-500 text-base font-medium leading-normal">
                +2.5%
              </p>
            </div>
          </div>

          {/* Right Side: Wallet Address */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-mono text-gray-800 dark:text-gray-200">
            <span>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-600 dark:text-gray-400 hover:text-primary transition flex items-center"
            >
              {copied ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            {copied && (
              <span className="ml-1 text-green-500 text-xs font-semibold">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Balance Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <button className="flex items-center justify-center whitespace-nowrap h-12 px-5 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition">
            <Plus size={18} /> <span className="ml-2">Add Money</span>
          </button>
          <button className="flex items-center justify-center whitespace-nowrap h-12 px-5 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition">
            <ArrowDownLeft size={18} /> <span className="ml-2">Withdraw</span>
          </button>
          <button className="flex items-center justify-center whitespace-nowrap h-12 px-5 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition">
            <Send size={18} /> <span className="ml-2">Send</span>
          </button>
        </div>
      </div>

      {/* Active Savings Goal */}
      <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-white/10 mt-6">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            Active Savings Goal
          </h2>
          <a
            href="#"
            className="text-primary text-sm font-semibold hover:underline"
          >
            View All
          </a>
        </div>

        {/* Goal 1 */}
        <div className="p-4 space-y-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                <Car size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-semibold">
                  New Car Fund
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  ${goal1Amount.toLocaleString()} of ${goal1Total.toLocaleString()}
                </p>
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-700"
                      style={{ width: `${goal1Percent}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 dark:text-white text-sm font-semibold">
                    {Math.round(goal1Percent)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <button className="flex items-center justify-center whitespace-nowrap flex-1 h-10 px-4 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-transform duration-200">
              <Plus size={16} className="mr-2" /> Add Money
            </button>
            <button className="flex items-center justify-center whitespace-nowrap flex-1 h-10 px-4 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-transform duration-200">
              <ArrowDownLeft size={16} className="mr-2" /> Withdraw
            </button>
          </div>
        </div>

        {/* Goal 2 */}
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center size-10 rounded-full bg-purple-500/10">
                <Plane size={18} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-semibold">
                  Vacation to Bali
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  ${goal2Amount.toLocaleString()} of ${goal2Total.toLocaleString()}
                </p>
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-700"
                      style={{ width: `${goal2Percent}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 dark:text-white text-sm font-semibold">
                    {Math.round(goal2Percent)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <button className="flex items-center justify-center whitespace-nowrap flex-1 h-10 px-4 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-transform duration-200">
              <Plus size={16} className="mr-2" /> Add Money
            </button>
            <button className="flex items-center justify-center whitespace-nowrap flex-1 h-10 px-4 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-transform duration-200">
              <ArrowDownLeft size={16} className="mr-2" /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-white/10 mt-6">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            Transaction History
          </h2>
          <a
            href="#"
            className="text-primary text-sm font-semibold hover:underline"
          >
            View All
          </a>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-white/10">
          {/* Deposit */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-500/10">
                <ArrowDownLeft size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  Deposit from Bank
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Oct 24, 2023
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-500">+$2,000.00</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Completed
              </p>
            </div>
          </div>

          {/* Withdrawal */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-red-500/10">
                <ArrowUpRight size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  Withdrawal to Bank
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Oct 21, 2023
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                -$500.00
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Completed
              </p>
            </div>
          </div>

          {/* Contribution */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-500/10">
                <PiggyBank size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  Contribution to Goal
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Oct 20, 2023
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                -$250.00
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Completed
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-yellow-500/10">
                <Send size={18} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  Send to @jane.doe
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Oct 19, 2023
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                -$100.00
              </p>
              <p className="text-yellow-500 text-sm">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
