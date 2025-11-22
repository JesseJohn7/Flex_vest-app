"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X } from "lucide-react";

export default function SavingsSection() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      emoji: "✈️",
      name: "Vacation to Bali",
      target: 2000,
      saved: 800,
    },
    {
      id: 2,
      emoji: "🚗",
      name: "Buy a Car",
      target: 5000,
      saved: 2500,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalEmoji, setGoalEmoji] = useState("💰");

  // Add new goal
  const handleAddGoal = () => {
    if (!goalName || !goalTarget) return;
    const newGoal = {
      id: Date.now(),
      emoji: goalEmoji,
      name: goalName,
      target: parseFloat(goalTarget),
      saved: 0,
    };
    setGoals([...goals, newGoal]);
    setGoalName("");
    setGoalTarget("");
    setGoalEmoji("💰");
    setShowForm(false);
  };

  // Add or withdraw
  const handleUpdateAmount = (id: number, type: "add" | "withdraw") => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          let newSaved =
            type === "add"
              ? goal.saved + goal.target * 0.1
              : goal.saved - goal.target * 0.1;
          if (newSaved < 0) newSaved = 0;
          if (newSaved > goal.target) newSaved = goal.target;
          return { ...goal, saved: newSaved };
        }
        return goal;
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Savings Goals
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition flex items-center gap-1"
        >
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {/* Active Goals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = (goal.saved / goal.target) * 100;
          return (
            <div
              key={goal.id}
              className="p-4 space-y-4 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center size-10 rounded-full bg-white/10 text-lg">
                    {goal.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {goal.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      ₦{goal.saved.toLocaleString()} of ₦
                      {goal.target.toLocaleString()}
                    </p>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          className="h-2 rounded-full bg-green-500 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700 dark:text-white text-sm font-semibold">
                        {Math.round(percent)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add / Withdraw */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleUpdateAmount(goal.id, "add")}
                  className="flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-sm transition"
                >
                  <Plus size={14} /> Add
                </button>
                <button
                  onClick={() => handleUpdateAmount(goal.id, "withdraw")}
                  className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm transition"
                >
                  <Minus size={14} /> Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Creation Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Create New Goal
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal name"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full p-2 rounded-md bg-transparent border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Target amount"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full p-2 rounded-md bg-transparent border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-white"
                />
                <div className="flex items-center gap-2">
                  {["💰", "✈️", "🚗", "🏠", "🎓", "📱"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setGoalEmoji(emoji)}
                      className={`text-2xl ${
                        goalEmoji === emoji
                          ? "scale-110"
                          : "opacity-60 hover:opacity-100"
                      } transition`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddGoal}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Save Goal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
