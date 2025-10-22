"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMenu, AiOutlinePlus, AiOutlineClose, AiOutlineCheckCircle, AiOutlineEdit, AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { Home, PiggyBank, History } from "lucide-react";
import "@solana/wallet-adapter-react-ui/styles.css";

type Goal = {
  id: number;
  title: string;
  target: number;
  current: number;
  progress: number;
};

type Transaction = {
  id: number;
  type: string;
  amount: number;
  date: string;
  goal?: string;
};

export default function Dashboard() {
  const { connected, publicKey, disconnect } = useWallet();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showBalance, setShowBalance] = useState(true);
  const [userName, setUserName] = useState("Jesse");
  const [currency, setCurrency] = useState("naira");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  
  // 🔥 MODAL & SUCCESS STATES
  const [showModal, setShowModal] = useState<'deposit' | 'withdraw' | 'addGoal' | 'addToGoal' | 'withdrawGoal' | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [amount, setAmount] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🔥 PERSISTENT STATE
  const [nairaBalance, setNairaBalance] = useState(340000);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: "Deposit", amount: 20000, date: "2025-10-20" },
    { id: 2, type: "Withdrawal", amount: 5000, date: "2025-10-21" },
    { id: 3, type: "Deposit", amount: 45000, date: "2025-10-22" },
  ]);
  
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: 1, 
      title: "Buy a new laptop", 
      target: 300000, 
      current: 150000,
      progress: 50 
    },
  ]);
  
  const exchangeRate = 1750;

  // 🔥 SAVE USERNAME TO LOCALSTORAGE
  useEffect(() => {
    const savedName = localStorage.getItem('flexvestUserName');
    if (savedName) setUserName(savedName);
  }, []);

  useEffect(() => {
    localStorage.setItem('flexvestUserName', userName);
  }, [userName]);

  // 🔥 FIXED LOAD/SAVE localStorage - CLEAN DATA!
  useEffect(() => {
    const savedData = localStorage.getItem('flexvestData');
    if (savedData) {
      try {
        const { balance, goals: savedGoals, transactions: savedTransactions } = JSON.parse(savedData);
        setNairaBalance(balance || 340000);
        setGoals((savedGoals as Goal[])?.map(goal => ({
          ...goal,
          progress: Math.min(100, (goal.current / goal.target) * 100)
        })) || []);
        setTransactions((savedTransactions as Transaction[])?.map((tx: Transaction) => ({
          ...tx,
          id: tx.id || Date.now(),
          date: tx.date || "2025-10-22"
        })) || []);
      } catch (error) {
        console.log("Clearing corrupted data");
        localStorage.removeItem('flexvestData');
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('flexvestData', JSON.stringify({
        balance: nairaBalance,
        goals: goals.map(goal => ({
          ...goal,
          progress: Math.min(100, (goal.current / goal.target) * 100)
        })),
        transactions: transactions
      }));
    }
  }, [nairaBalance, goals, transactions, isMounted]);

  // 🔥 PROFILE HANDLERS
  const handleNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const saveName = () => {
    if (tempName?.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
      setSuccessMessage(`✅ Name updated to "${tempName.trim()}"!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const cancelEdit = () => {
    setIsEditingName(false);
    setTempName(userName);
  };

  const handleLogout = async () => {
    await disconnect();
    router.replace("/");
  };

  // 🔥 MODAL HANDLERS
  const handleDeposit = () => { setShowModal('deposit'); setAmount(""); };
  const handleWithdraw = () => { setShowModal('withdraw'); setAmount(""); };
  const handleAddGoal = () => { 
    setShowModal('addGoal'); 
    setGoalTitle(""); 
    setGoalTarget(""); 
  };
  
  const handleAddToGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setShowModal('addToGoal');
    setAmount("");
  };
  
  const handleWithdrawFromGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setShowModal('withdrawGoal');
    setAmount("");
  };

  // 🔥 SUBMIT AMOUNT - FIXED!
  const submitAmount = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) return;

    const currentDate = new Date().toISOString().split('T')[0];

    switch (showModal) {
      case 'deposit':
        setNairaBalance(prev => prev + numAmount);
        setTransactions(prev => [{
          id: Date.now(), 
          type: "Deposit", 
          amount: numAmount, 
          date: currentDate
        }, ...prev]);
        setSuccessMessage(`✅ ₦${numAmount.toLocaleString()} added to wallet!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        break;
        
      case 'withdraw':
        if (numAmount <= nairaBalance) {
          setNairaBalance(prev => prev - numAmount);
          setTransactions(prev => [{
            id: Date.now(), 
            type: "Withdrawal", 
            amount: numAmount, 
            date: currentDate
          }, ...prev]);
          setSuccessMessage(`✅ ₦${numAmount.toLocaleString()} withdrawn!`);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          setShowModal(null);
          setAmount("");
        }
        break;
        
      case 'addToGoal':
        if (currentGoal) {
          const remaining = currentGoal.target - currentGoal.current;
          const maxAllowed = Math.min(nairaBalance, remaining);
          if (numAmount <= maxAllowed) {
            const newGoals = goals.map(g => 
              g.id === currentGoal.id 
                ? { ...g, current: g.current + numAmount, 
                    progress: Math.min(100, ((g.current + numAmount) / g.target) * 100) }
                : g
            );
            setGoals(newGoals);
            setNairaBalance(prev => prev - numAmount);
            setTransactions(prev => [{
              id: Date.now(), 
              type: "Goal Deposit", 
              amount: numAmount, 
              date: currentDate, 
              goal: currentGoal.title
            }, ...prev]);
            setSuccessMessage(`✅ ₦${numAmount.toLocaleString()} added to "${currentGoal.title}"!`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
          } else {
            alert(`❌ Max allowed: ₦${maxAllowed.toLocaleString()}`);
            return;
          }
        }
        break;
        
      case 'withdrawGoal':
        if (currentGoal && numAmount <= currentGoal.current) {
          const newGoals = goals.map(g => 
            g.id === currentGoal.id 
              ? { ...g, current: g.current - numAmount, 
                  progress: ((g.current - numAmount) / g.target) * 100 }
              : g
          );
          setGoals(newGoals);
          setNairaBalance(prev => prev + numAmount);
          setTransactions(prev => [{
            id: Date.now(), 
            type: "Goal Withdrawal", 
            amount: numAmount, 
            date: currentDate, 
            goal: currentGoal.title
          }, ...prev]);
          setSuccessMessage(`✅ ₦${numAmount.toLocaleString()} withdrawn from "${currentGoal.title}"!`);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
        break;
    }
    
    setShowModal(null);
    setAmount("");
  };

  // 🔥 CREATE GOAL
  const submitGoal = () => {
    if (goalTitle.trim() && goalTarget && parseInt(goalTarget) > 0) {
      const target = parseInt(goalTarget);
      const newGoal: Goal = {
        id: Date.now(),
        title: goalTitle.trim(),
        target,
        current: 0,
        progress: 0
      };
      setGoals(prev => [...prev, newGoal]);
      setShowModal(null);
      setGoalTitle("");
      setGoalTarget("");
      setSuccessMessage(`🎉 "${newGoal.title}" created successfully!\nTarget: ₦${target.toLocaleString()}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Please enter both goal name and target amount!");
    }
  };

  useEffect(() => {
    const checkWallet = setTimeout(() => {
      if (isMounted && (!connected || !publicKey)) {
        router.replace("/");
      }
    }, 100);
    return () => clearTimeout(checkWallet);
  }, [connected, publicKey, isMounted, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" suppressHydrationWarning>
        <div className="text-green-400 text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  if (!connected || !publicKey) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const convertToUSDT = (naira: number) => (naira / exchangeRate).toFixed(2);

  const sidebarMenu = [
    { id: "home", label: "Home", icon: Home },
    { id: "goals", label: "Savings", icon: PiggyBank },
    { id: "transactions", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: AiOutlineUser },
  ];

  const isAddGoalDisabled = !goalTitle.trim() || !goalTarget || parseInt(goalTarget) <= 0;
  const isAmountDisabled = !amount || parseInt(amount) <= 0;
  const isAddToGoalDisabled = !!(showModal === 'addToGoal' && currentGoal && (
    !amount || parseInt(amount) <= 0 ||
    parseInt(amount) > nairaBalance ||
    parseInt(amount) > (currentGoal.target - currentGoal.current)
  ));
  const isWithdrawGoalDisabled = !!(showModal === 'withdrawGoal' && currentGoal && (
    !amount || parseInt(amount) <= 0 ||
    parseInt(amount) > currentGoal.current
  ));

  const recentTransactions = transactions.slice(-10);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 p-3">
        <div className="flex justify-between items-center">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-white p-1">
            <AiOutlineMenu size={20} />
          </button>
          <div className="text-green-400 text-lg font-bold">Flexvest</div>
          <WalletMultiButton className="bg-white text-black px-1.5 py-0.5 rounded text-xs font-semibold" />
        </div>
      </header>

      <div className={`flex min-h-screen ${showSidebar ? 'overflow-hidden' : ''}`}>
        <aside className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-12 md:top-0 left-0 h-screen md:h-auto w-64 bg-gray-900 border-r border-gray-800 z-40 md:z-auto transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <div className="text-green-400 text-xl font-bold mb-10">Flexvest</div>
            {sidebarMenu.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => {setActiveTab(id); setShowSidebar(false);}} className={`flex items-center py-3 px-4 rounded-lg mb-2 w-full text-left transition ${activeTab === id ? "bg-green-500 text-black font-semibold" : "text-gray-400 hover:bg-gray-800"}`}>
                <Icon size={20} className={`mr-3 ${activeTab === id ? 'text-black' : 'text-gray-400'}`} />
                <span className="capitalize">{label}</span>
              </button>
            ))}
          </div>
        </aside>

        {showSidebar && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setShowSidebar(false)} />}

        <div className="flex-1 ml-0 md:ml-4 pt-0 md:pt-0">
          {/* HEADERS */}
          <header className="hidden md:flex justify-between items-center p-6 pb-2 border-b border-gray-800">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-semibold">{getGreeting()}, {userName}! 👋</h2>
                <p className="text-gray-400 text-sm">Start Saving Today!</p>
              </div>
              <button onClick={() => setActiveTab("profile")} className="ml-6 p-2 text-gray-400 hover:text-white transition-colors rounded-full self-start">
                <AiOutlineUser size={20} />
              </button>
            </div>
            <WalletMultiButton className="bg-white text-black px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors" />
          </header>

          <div className="md:hidden pt-20 pb-6 px-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{getGreeting()}, {userName}! 👋</h2>
                <p className="text-gray-400 text-sm">Start Saving Today!</p>
              </div>
              <button onClick={() => setActiveTab("profile")} className="mt-1 p-2 text-gray-400 hover:text-white transition-colors rounded-full self-start">
                <AiOutlineUser size={20} />
              </button>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-6">
            {activeTab === "home" && (
              <div>
                {/* WALLET BALANCE */}
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 mb-6 border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-400 text-sm">Wallet Balance</h3>
                    <button onClick={() => setCurrency(currency === "naira" ? "usdt" : "naira")} className="bg-gray-800 px-3 py-1.5 rounded-md text-xs hover:bg-gray-700">
                      {currency === "naira" ? "View in USDT" : "View in ₦"}
                    </button>
                  </div>

                  <div className="flex items-center mb-6">
                    <p className="text-3xl sm:text-4xl font-bold text-white-400 mr-2">
                      {showBalance ? (currency === "naira" ? `₦${nairaBalance.toLocaleString()}` : `${convertToUSDT(nairaBalance)} USDT`) : "••••••"}
                    </p>
                    <button onClick={() => setShowBalance(!showBalance)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      {showBalance ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleDeposit} className="bg-green-500 text-black px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition flex-1 sm:flex-none">
                      Add Money
                    </button>
                    <button onClick={handleWithdraw} className="bg-red-400 text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition flex-1 sm:flex-none" disabled={nairaBalance === 0}>
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* GOALS */}
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 mb-6 border border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-400 font-medium">Active Savings Goals 🎯</h3>
                    <button onClick={handleAddGoal} className="flex items-center gap-1 bg-white-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-600 transition">
                      <AiOutlinePlus size={14} /> Add Goal
                    </button>
                  </div>
                  
                  {goals.map((goal) => (
                    <div key={goal.id} className={`p-4 rounded-lg mb-4 ${goal.progress >= 100 ? 'bg-green-900 border-2 border-green-500' : 'bg-gray-800'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`font-medium mb-1 ${goal.progress >= 100 ? 'text-green-400' : 'text-white'}`}>
                            {goal.title} {goal.progress >= 100 && '🎉'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>₦{goal.current.toLocaleString()}</span>
                            <span className="text-gray-500">/</span>
                            <span>₦{goal.target.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="text-green-400 font-medium">{Math.round(goal.progress)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 h-2 rounded-lg mb-3">
                        <div className={`h-2 rounded-lg transition-all duration-300 ${goal.progress >= 100 ? 'bg-green-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, goal.progress)}%` }} />
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => handleAddToGoal(goal)} className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${goal.progress >= 100 ? 'bg-green-700 text-white cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-600'}`} disabled={nairaBalance === 0 || goal.progress >= 100}>
                          {goal.progress >= 100 ? '🎉 COMPLETED' : '+ Add from Wallet'}
                        </button>
                        <button onClick={() => handleWithdrawFromGoal(goal)} className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed" disabled={goal.current === 0}>
                          - Withdraw to Wallet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RECENT TRANSACTIONS */}
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 h-[400px] flex flex-col">
                  <h3 className="text-green-400 font-medium mb-3">Recent Transactions 💳 ({recentTransactions.length})</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 px-2 rounded">
                          <div>
                            <span className="font-medium">{tx.type}</span>
                            {tx.goal && <span className="text-gray-400 ml-2">({tx.goal})</span>}
                          </div>
                          <span className={tx.type.includes("Deposit") || tx.type === "Goal Deposit" ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                            {tx.type.includes("Deposit") ? "+" : "-"}{tx.amount.toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        No transactions yet. Make your first deposit!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GOALS TAB */}
            {activeTab === "goals" && (
              <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-green-400 font-medium">Your Savings Goals 🎯</h3>
                  <button onClick={handleAddGoal} className="bg-green-500 text-black px-4 py-2 rounded-md text-sm hover:bg-green-600">
                    + Add Goal
                  </button>
                </div>
                {goals.map((goal) => (
                  <div key={goal.id} className={`p-4 rounded-lg mb-3 ${goal.progress >= 100 ? 'bg-green-900 border-2 border-green-500' : 'bg-gray-800'}`}>
                    <div className="flex justify-between mb-1">
                      <span className={`font-medium ${goal.progress >= 100 ? 'text-green-400' : 'text-white'}`}>
                        {goal.title} {goal.progress >= 100 && '🎉'}
                      </span>
                      <span className="text-green-400">{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      ₦{goal.current.toLocaleString()} / ₦{goal.target.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-lg">
                      <div className={`h-2 rounded-lg ${goal.progress >= 100 ? 'bg-green-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, goal.progress)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "transactions" && (
              <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 h-screen max-h-[calc(100vh-200px)] flex flex-col">
                <h3 className="text-green-400 font-medium mb-4">Transaction History 💳 ({transactions.length})</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center text-sm py-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 px-2 py-2 rounded">
                        <div>
                          <div className="font-medium text-white">{tx.date}</div>
                          <div className="text-gray-400">{tx.type}</div>
                          {tx.goal && <div className="text-xs text-gray-500">Goal: {tx.goal}</div>}
                        </div>
                        <span className={tx.type.includes("Deposit") || tx.type === "Goal Deposit" ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                          {tx.type.includes("Deposit") ? "+" : "-"}{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      No transactions yet. Make your first deposit!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 🔥 BEAUTIFUL PROFILE TAB - DISPLAY NAME AT TOP */}
            {activeTab === "profile" && (
              <div className="max-w-md mx-auto space-y-6">
                {/* DISPLAY NAME - TOP */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                    <AiOutlineUser size={20} /> Display Name
                  </h3>
                  
                  {isEditingName ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                          placeholder="Enter your name"
                        />
                        <AiOutlineEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg font-medium hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveName}
                          disabled={!tempName?.trim()}
                          className="flex-1 bg-green-500 text-black py-2.5 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition"
                        >
                          Save Name
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-black font-semibold text-sm">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-lg">{userName}</p>
                          <p className="text-gray-400 text-sm">Your display name</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleNameEdit}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
                      >
                        <AiOutlineEdit size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* WALLET STATUS - BOTTOM */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                    <AiOutlineUser size={20} /> Wallet Status
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium">Connected</span>
                    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
                  >
                    <AiOutlineLogout size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 DESIGNER MODALS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md ${showModal === 'addGoal' ? 'max-w-lg' : ''} animate-in slide-in-from-bottom-4 duration-300`}>
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                {showModal === 'deposit' && <AiOutlineCheckCircle className="text-green-400" size={20} />}
                {showModal === 'withdraw' && <AiOutlineClose className="text-red-400" size={20} />}
                {showModal === 'addGoal' && <AiOutlinePlus className="text-green-400" size={20} />}
                {showModal === 'addToGoal' && <AiOutlineCheckCircle className="text-green-400" size={20} />}
                {showModal === 'withdrawGoal' && <AiOutlineClose className="text-red-400" size={20} />}
                
                <h3 className="text-xl font-semibold text-white">
                  {showModal === 'deposit' && 'Add Money'}
                  {showModal === 'withdraw' && 'Withdraw Money'}
                  {showModal === 'addGoal' && 'New Savings Goal'}
                  {showModal === 'addToGoal' && `Add to ${currentGoal?.title}`}
                  {showModal === 'withdrawGoal' && `Withdraw from ${currentGoal?.title}`}
                </h3>
              </div>
              <button onClick={() => {setShowModal(null); setAmount(""); setGoalTitle(""); setGoalTarget("");}} className="p-1 text-gray-400 hover:text-white">
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {showModal === 'addGoal' ? (
                <>
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="Goal name (e.g. Vacation)"
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="Target amount (₦)"
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-400 mb-2">
                    {showModal === 'deposit' && `Available balance: ₦${nairaBalance.toLocaleString()}`}
                    {showModal === 'withdraw' && `Available balance: ₦${nairaBalance.toLocaleString()}`}
                    {showModal === 'addToGoal' && currentGoal && `Wallet: ₦${nairaBalance.toLocaleString()} | Remaining: ₦${(currentGoal.target - currentGoal.current).toLocaleString()}`}
                    {showModal === 'withdrawGoal' && currentGoal && `Available in goal: ₦${currentGoal.current.toLocaleString()}`}
                  </div>
                  
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-gray-800 text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
                    />
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {setShowModal(null); setAmount(""); setGoalTitle(""); setGoalTarget("");}}
                className="px-6 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={showModal === 'addGoal' ? submitGoal : submitAmount}
                disabled={
                  showModal === 'addGoal' 
                    ? isAddGoalDisabled 
                    : showModal === 'addToGoal' 
                      ? isAddToGoalDisabled 
                      : showModal === 'withdrawGoal' 
                        ? isWithdrawGoalDisabled 
                        : isAmountDisabled
                }
                className="px-6 py-2 bg-green-500 text-black font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition"
              >
                {showModal === 'addGoal' ? 'Create Goal' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-900 border-2 border-green-500 rounded-xl p-4 text-white animate-in slide-in-from-right-4 duration-300 max-w-sm">
            <AiOutlineCheckCircle className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-center whitespace-pre-line">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}