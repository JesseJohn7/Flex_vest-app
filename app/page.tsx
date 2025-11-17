"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0b] via-[#0f0f12] to-[#0b0b0b] text-white px-5 sm:px-8 md:px-12">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-500/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-extrabold leading-tight mb-4 text-[2rem] sm:text-[2.6rem] md:text-[3.5rem] lg:text-[4rem]"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-600 bg-clip-text text-transparent">
            FlexVest
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gray-400 leading-relaxed mb-8 text-[0.95rem] sm:text-base md:text-lg max-w-md mx-auto"
        >
          A next-generation dashboard built with Next.js & Framer Motion —
          sleek, dark, and engineered to impress.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-transform duration-150 font-semibold shadow-lg text-sm sm:text-base w-[200px] sm:w-auto"
          >
            Enter Dashboard <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-xs sm:text-sm text-gray-500"
        >
          Designed with ❤️ by Jesse • 2025
        </motion.p>
      </div>
    </main>
  );
}
