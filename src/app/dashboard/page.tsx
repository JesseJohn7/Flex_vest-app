"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!connected) router.push("/");
  }, [connected, isMounted, router]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10">
        <div className="text-green-400 font-semibold text-lg">Flexvest</div>
        <WalletMultiButton className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors" />
      </nav>

      {/* Dashboard Content */}
      <main className="flex-1 bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-2xl max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold">My Dashboard</h2>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mt-4 sm:mt-0 transition"
          >
            {showBalance ? (
              <>
                <AiOutlineEyeInvisible className="text-lg" />
                <span>Hide Balance</span>
              </>
            ) : (
              <>
                <AiOutlineEye className="text-lg" />
                <span>Show Balance</span>
              </>
            )}
          </button>
        </div>

        {/* Wallet Balance Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 text-center shadow-inner">
          <h3 className="text-gray-400 text-sm mb-2">Wallet Balance</h3>
          <p className="text-4xl font-bold text-green-400 mb-4">
            {showBalance ? "₦ — — — —" : "••••••"}
          </p>
          {publicKey && (
            <p className="text-gray-500 text-sm mb-6 truncate">
              {publicKey.toBase58()}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button className="bg-green-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-600 transition">
              Add Money
            </button>
            <button className="bg-gray-200 text-black px-5 py-2 rounded-xl font-medium hover:bg-gray-300 transition">
              Withdraw
            </button>
          </div>
        </div>

        {/* Actions / To-do Section */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-green-400 flex items-center gap-2">
              Quick Actions ⚡
            </h3>
            <button className="text-gray-400 text-sm hover:text-white">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 cursor-pointer transition text-center">
              <p className="text-gray-300">Track Portfolio</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 cursor-pointer transition text-center">
              <p className="text-gray-300">View Earnings</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 cursor-pointer transition text-center">
              <p className="text-gray-300">Check Transactions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
