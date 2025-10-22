"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ FIXED: Only redirect IF connected
  useEffect(() => {
    if (!isMounted) return;
    if (connected) {
      router.push("/dashboard");
    }
    // ✅ REMOVED: No else clause = No infinite loop!
  }, [connected, isMounted, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading...</div>
      </div>
    );
  }

  // ✅ PROTECTED: Only show connect UI if NOT connected
  if (connected) {
    return null; // Will redirect automatically
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-gray-800">
        {/* Wallet Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center">
          <FaWallet className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
        </div>

        {/* Title Text */}
        <p className="text-gray-300 text-base sm:text-lg font-medium mb-6 sm:mb-8 leading-relaxed px-2">
          Connect your wallet to use Flexvest
        </p>

        {/* Connect Button */}
        <div className="flex justify-center">
          <WalletMultiButton
            className="px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors border-0 text-sm"
          />
        </div>
      </div>
    </div>
  );
}