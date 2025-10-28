"use client";

import { useState, useEffect } from "react";
import { 
  useWallet, 
  useConnection 
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { 
  PublicKey, 
  Transaction as SolanaTransaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { 
  AiOutlineEye, 
  AiOutlineEyeInvisible, 
  AiOutlineMenu, 
  AiOutlinePlus, 
  AiOutlineClose, 
  AiOutlineCheckCircle, 
  AiOutlineEdit, 
  AiOutlineUser, 
  AiOutlineLogout, 
  AiOutlineDelete, 
  AiOutlineCopy 
} from "react-icons/ai";
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
  signature?: string;
};

type Rates = {
  solUsd: number;
  usdNgn: number;
};

type SavedData = {
  goals: Goal[];
  transactions: Transaction[];
  solBalance: number;
};

export default function Dashboard() {
  const { 
    connected, 
    publicKey, 
    disconnect,
    signTransaction 
  } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showBalance, setShowBalance] = useState(true);
  const [userName, setUserName] = useState("Flexvester");
  const [currency, setCurrency] = useState("naira");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  
  const [showModal, setShowModal] = useState<'deposit' | 'withdraw' | 'addGoal' | 'addToGoal' | 'withdrawGoal' | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [amount, setAmount] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [appWalletPublicKey] = useState(() => new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"));
  const [solBalance, setSolBalance] = useState(0.00);
  const [rates, setRates] = useState<Rates>({ solUsd: 183, usdNgn: 1640 });
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // 🔥 COINGECKO LIVE RATES
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,ngn');
        if (!res.ok) return;
        const data = await res.json();
        if (data.solana?.usd && data.solana?.ngn) {
          setRates({
            solUsd: data.solana.usd,
            usdNgn: data.solana.ngn / data.solana.usd
          });
        }
      } catch (error) {
        console.error("Rates failed:", error);
      }
    };
    fetchRates();
  }, []);

  // 🔥 LOAD SAVED DATA (GOALS + TRANSACTIONS + BALANCE)
  useEffect(() => {
    const savedName = localStorage.getItem('flexvestUserName');
    if (savedName) setUserName(savedName);

    const savedData = localStorage.getItem('flexvestData');
    if (savedData) {
      try {
        const parsedData: SavedData = JSON.parse(savedData);
        
        // 🔥 LOAD USER-CREATED GOALS
        const loadedGoals = (parsedData.goals || []) as Goal[];
        setGoals(loadedGoals.map(goal => ({
          ...goal,
          progress: goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0
        })));
        
        // 🔥 LOAD USER-CREATED TRANSACTIONS
        const loadedTransactions = (parsedData.transactions || []) as Transaction[];
        setTransactions(loadedTransactions.map((tx: Transaction) => ({
          ...tx,
          id: tx.id || Date.now(),
          date: tx.date || new Date().toISOString().split('T')[0]
        })));
        
        // 🔥 LOAD SAVED BALANCE
        setSolBalance(parsedData.solBalance || 0.00);
        
      } catch (error) {
        console.error("Load data failed:", error);
        localStorage.removeItem('flexvestData');
      }
    }
    setIsMounted(true);
  }, []);

  // 🔥 SAVE DATA TO LOCALSTORAGE (INCLUDING BALANCE)
  useEffect(() => {
    if (isMounted) {
      const dataToSave: SavedData = {
        goals: goals.map(goal => ({
          ...goal,
          progress: goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0
        })),
        transactions,
        solBalance
      };
      
      localStorage.setItem('flexvestData', JSON.stringify(dataToSave));
    }
  }, [goals, transactions, solBalance, isMounted]);

  // 🔥 SAVE USERNAME
  useEffect(() => {
    localStorage.setItem('flexvestUserName', userName);
  }, [userName]);

  // 🔥 NOTIFICATION TIMERS
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const saveName = () => {
    if (tempName?.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
      setSuccessMessage("✅ Name updated!");
      setShowSuccess(true);
    }
  };

  const cancelEdit = () => {
    setIsEditingName(false);
    setTempName(userName);
  };

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.replace("/");
  };

  const handleDeposit = () => { 
    setShowModal('deposit'); 
    setAmount(""); 
  };
  
  const handleWithdraw = () => { 
    setShowModal('withdraw'); 
    setAmount(""); 
  };
  
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

  const handleDeleteGoal = (goalId: number) => {
    if (confirm("Delete this savings goal?")) {
      const goalToDelete = goals.find(g => g.id === goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      setTransactions(prev => prev.filter(tx => !tx.goal || tx.goal !== goalToDelete?.title));
      setSuccessMessage("🗑️ Goal deleted!");
      setShowSuccess(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage("📋 Copied to clipboard!");
      setShowSuccess(true);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSolDeposit = async () => {
    if (!publicKey || !signTransaction || !amount || parseFloat(amount) <= 0) return;

    const dollarAmount = parseFloat(amount);
    const solAmount = dollarAmount / rates.solUsd;
    
    try {
      const transaction = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: appWalletPublicKey,
          lamports: Math.floor(solAmount * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "processed");

      setSolBalance(prev => prev + solAmount);

      setTransactions(prev => [{
        id: Date.now(),
        type: "Deposit",
        amount: dollarAmount,
        date: new Date().toISOString().split('T')[0],
        signature: signature
      }, ...prev]);

      const nairaAmount = Math.floor(dollarAmount * rates.usdNgn);
      setSuccessMessage(`✅ $${dollarAmount.toFixed(2)} deposited!\n₦${nairaAmount.toLocaleString()}`);
      setShowSuccess(true);

    } catch (error) {
      console.error("Deposit failed:", error);
      setErrorMessage(" Deposit failed ❌ - Check wallet connection");
      setShowError(true);
    }
  };

  const handleSolWithdraw = async () => {
    if (!publicKey || !signTransaction || !amount || parseFloat(amount) <= 0) return;

    const dollarAmount = parseFloat(amount);
    const currentDollarBalance = solBalance * rates.solUsd;
    
    if (dollarAmount > currentDollarBalance) {
      setErrorMessage(` Insufficient balance\nMax:  $${currentDollarBalance.toFixed(2)}`);
      setShowError(true);
      return;
    }

    const solAmount = dollarAmount / rates.solUsd;
    
    try {
      const transaction = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: appWalletPublicKey,
          toPubkey: publicKey,
          lamports: Math.floor(solAmount * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "processed");

      setSolBalance(prev => prev - solAmount);

      setTransactions(prev => [{
        id: Date.now(),
        type: "Withdrawal",
        amount: dollarAmount,
        date: new Date().toISOString().split('T')[0],
        signature: signature
      }, ...prev]);

      const nairaAmount = Math.floor(dollarAmount * rates.usdNgn);
      setSuccessMessage(`✅ $${dollarAmount.toFixed(2)} withdrawn to wallet!\n₦${nairaAmount.toLocaleString()}`);
      setShowSuccess(true);

    } catch (error) {
      console.error("Withdraw failed:", error);
      setErrorMessage("❌ Withdraw failed - Try again");
      setShowError(true);
    }
  };

  const submitAmount = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    switch (showModal) {
      case 'deposit':
        await handleSolDeposit();
        break;
        
      case 'withdraw':
        await handleSolWithdraw();
        break;
        
      case 'addToGoal':
        if (currentGoal) {
          const remaining = currentGoal.target - currentGoal.current;
          
          if (numAmount > remaining) {
            setErrorMessage(`Max: $${remaining.toFixed(2)} ❌ `);
            setShowError(true);
            return;
          }

          const newGoals = goals.map(g => 
            g.id === currentGoal.id 
              ? { 
                  ...g, 
                  current: g.current + numAmount, 
                  progress: Math.min(100, ((g.current + numAmount) / g.target) * 100) 
                }
              : g
          );
          setGoals(newGoals);
          setSolBalance(prev => prev - (numAmount / rates.solUsd));
          
          setTransactions(prev => [{
            id: Date.now(), 
            type: "Goal Deposit", 
            amount: numAmount,
            date: new Date().toISOString().split('T')[0], 
            goal: currentGoal.title
          }, ...prev]);
          
          const nairaAmount = Math.floor(numAmount * rates.usdNgn);
          setSuccessMessage(`✅ $${numAmount.toFixed(2)} added to '${currentGoal.title}'!\n₦${nairaAmount.toLocaleString()}`);
          setShowSuccess(true);
        }
        break;
        
      case 'withdrawGoal':
        if (currentGoal && numAmount > currentGoal.current) {
          setErrorMessage(`❌ Max: $${currentGoal.current.toFixed(2)}`);
          setShowError(true);
          return;
        }

        const newGoals = goals.map(g => 
          g.id === currentGoal!.id 
            ? { 
                ...g, 
                current: g.current - numAmount, 
                progress: Math.max(0, ((g.current - numAmount) / g.target) * 100) 
              }
            : g
        );
        setGoals(newGoals);
        setSolBalance(prev => prev + (numAmount / rates.solUsd));
        
        setTransactions(prev => [{
          id: Date.now(), 
          type: "Goal Withdrawal", 
          amount: numAmount,
          date: new Date().toISOString().split('T')[0], 
          goal: currentGoal!.title
        }, ...prev]);
        
        const nairaAmount = Math.floor(numAmount * rates.usdNgn);
        setSuccessMessage(`✅ $${numAmount.toFixed(2)} withdrawn from '${currentGoal!.title}'!\n₦${nairaAmount.toLocaleString()}`);
        setShowSuccess(true);
        break;
    }
    
    setShowModal(null);
    setAmount("");
  };

  const submitGoal = () => {
    if (!goalTitle.trim() || !goalTarget || parseFloat(goalTarget) <= 0) {
      setErrorMessage("Enter valid goal name and target amount in USDT");
      setShowError(true);
      return;
    }

    const target = parseFloat(goalTarget);
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
    
    const nairaTarget = Math.floor(target * rates.usdNgn);
    setSuccessMessage(`🎉 '${newGoal.title}' created!\nTarget: $${target.toFixed(2)} (₦${nairaTarget.toLocaleString()})`);
    setShowSuccess(true);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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

  const dollarBalance = solBalance * rates.solUsd;
  const nairaBalance = dollarBalance * rates.usdNgn;

  const sidebarMenu = [
    { id: "home", label: "Home", icon: Home },
    { id: "goals", label: "Savings", icon: PiggyBank },
    { id: "transactions", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: AiOutlineUser },
  ];

  const isAddGoalDisabled = !goalTitle.trim() || !goalTarget || parseFloat(goalTarget) <= 0;
  const isAmountDisabled = !amount || parseFloat(amount) <= 0;
  const nairaPreview = parseFloat(amount || "0") * rates.usdNgn;
  const recentTransactions = transactions.slice(-1000);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 p-3">
        <div className="flex justify-between items-center">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-white p-1">
            <AiOutlineMenu size={20} />
          </button>
          <div className="text-white text-lg font-bold">Flexvest</div>
          <WalletMultiButton className="bg-white text-black px-1.5 py-0.5 rounded text-xs font-semibold" />
        </div>
      </header>

      <div className={`flex min-h-screen ${showSidebar ? 'overflow-hidden' : ''}`}>
        <aside className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-12 md:top-0 left-0 h-screen md:h-auto w-64 bg-gray-900 border-r border-gray-800 z-40 md:z-auto transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <div className="text-white text-xl font-bold mb-10">Flexvest</div>
            {sidebarMenu.map(({ id, label, icon: Icon }) => (
              <button 
                key={id} 
                onClick={() => { 
                  setActiveTab(id); 
                  setShowSidebar(false); 
                }} 
                className={`flex items-center py-3 px-4 rounded-lg mb-2 w-full text-left transition ${
                  activeTab === id 
                    ? "bg-green-500 text-black font-semibold" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={20} className={`mr-3 ${activeTab === id ? 'text-black' : 'text-gray-300'}`} />
                <span className="capitalize">{label}</span>
              </button>
            ))}
          </div>
        </aside>

        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={() => setShowSidebar(false)} 
          />
        )}

        <div className="flex-1 ml-0 md:ml-4 pt-0 md:pt-0">
          <header className="hidden md:flex justify-between items-center p-6 pb-2 border-b border-gray-800">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white">{getGreeting()}, {userName}! 👋</h2>
                <p className="text-gray-300 text-sm">Start saving today</p>
              </div>
              <button 
                onClick={() => setActiveTab("profile")} 
                className="ml-6 p-2 text-gray-300 hover:text-white transition-colors rounded-full self-start"
              >
                <AiOutlineUser size={20} />
              </button>
            </div>
            <WalletMultiButton className="bg-white text-black px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors" />
          </header>

          <div className="md:hidden pt-20 pb-6 px-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{getGreeting()}, {userName}! 👋</h2>
                <p className="text-gray-300 text-sm">Start saving today</p>
              </div>
              <button 
                onClick={() => setActiveTab("profile")} 
                className="mt-1 p-2 text-gray-300 hover:text-white transition-colors rounded-full self-start"
              >
                <AiOutlineUser size={20} />
              </button>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-6">
            {activeTab === "home" && (
              <div>
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 mb-6 border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-300 text-sm">Wallet Balance</h3>
                    <button 
                      onClick={() => setCurrency(currency === "naira" ? "usdt" : "naira")} 
                      className="bg-gray-800 px-3 py-1.5 rounded-md text-xs hover:bg-gray-700 text-gray-300"
                    >
                      {currency === "naira" ? "View in USDT" : "View in ₦"}
                    </button>
                  </div>

                  <div className="flex items-center mb-6">
                    <p className="text-3xl sm:text-4xl font-bold text-white mr-2">
                      {showBalance ? 
                        (currency === "naira" ? `₦${nairaBalance.toLocaleString()}` : `$${dollarBalance.toFixed(2)}`) : 
                        "••••••"
                      }
                    </p>
                    <button 
                      onClick={() => setShowBalance(!showBalance)} 
                      className="p-1 text-gray-300 hover:text-white transition-colors"
                    >
                      {showBalance ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleDeposit} 
                      className="bg-green-500 text-black px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition flex-1 sm:flex-none"
                    >
                      Add Money
                    </button>
                    <button 
                      onClick={handleWithdraw} 
                      className="bg-red-400 text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition flex-1 sm:flex-none" 
                      disabled={solBalance === 0}
                    >
                      Withdraw Money
                    </button>
                  </div>
                </div>
                {/* SAVINGS - EMPTY STATE */}
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 mb-6 border border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-medium">Savings Goals</h3>
                    <button 
                      onClick={handleAddGoal} 
                      className="flex items-center gap-1 bg-green-500 text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-600 transition"
                    >
                      <AiOutlinePlus size={14} /> Create Goal
                    </button>
                  </div>
                  
                  {goals.length === 0 ? (
                    <div className="text-center py-12 text-gray-300">
                      <PiggyBank className="mx-auto mb-4 text-gray-500" size={48} />
                      <p className="text-lg text-white mb-2">No savings goals yet</p>
                      <p className="text-sm">Click "Create Goal" to start your first savings plan</p>
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div 
                        key={goal.id} 
                        className={`p-4 rounded-lg mb-4 ${
                          goal.progress >= 100 
                            ? 'bg-green-900 border-2 border-green-500' 
                            : 'bg-gray-800 border border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className={`font-medium mb-1 ${
                              goal.progress >= 100 ? 'text-green-400' : 'text-white'
                            }`}>
                              {goal.title} {goal.progress >= 100 && '🎉'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>${goal.current.toFixed(2)}</span>
                              <span className="text-gray-500">/</span>
                              <span>${goal.target.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            <button 
                              onClick={() => handleDeleteGoal(goal.id)} 
                              className="p-1.5 text-red-400 hover:text-red-300"
                            >
                              <AiOutlineDelete size={16} />
                            </button>
                            <span className="text-white font-medium">
                              {Math.round(goal.progress)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 h-2 rounded-lg mb-3">
                          <div 
                            className={`h-2 rounded-lg transition-all duration-300 ${
                              goal.progress >= 100 ? 'bg-green-400' : 'bg-green-500'
                            }`} 
                            style={{ width: `${Math.min(100, goal.progress)}%` }} 
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToGoal(goal)} 
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                              goal.progress >= 100 
                                ? 'bg-green-700 text-white cursor-not-allowed' 
                                : 'bg-green-500 text-black hover:bg-green-600'
                            }`} 
                            disabled={dollarBalance === 0 || goal.progress >= 100}
                          >
                            {goal.progress >= 100 ? '🎉 COMPLETED' : '+ Add Money'}
                          </button>
                          <button 
                            onClick={() => handleWithdrawFromGoal(goal)} 
                            className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed" 
                            disabled={goal.current === 0}
                          >
                            - Withdraw
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* RECENT TRANSACTIONS - EMPTY STATE */}
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 h-[400px] flex flex-col">
                  <h3 className="text-white font-medium mb-3">
                    Recent Transactions ({recentTransactions.length})
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex justify-between items-center text-sm py-2 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 px-2 rounded"
                        >
                          <div>
                            <span className="font-medium text-white">{tx.type}</span>
                            {tx.goal && <span className="text-gray-300 ml-2">({tx.goal})</span>}
                          </div>
                          <span className={`${
                            tx.type.includes("Deposit") || tx.type === "Goal Deposit" 
                              ? "text-green-400 font-medium" 
                              : "text-red-400 font-medium"
                          }`}>
                            {tx.type.includes("Deposit") ? "+" : "-"}${(tx.amount || 0).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-300 py-8">
                        <History className="mx-auto mb-4 text-gray-500" size={48} />
                        <p className="text-lg text-white mb-2">No transactions yet</p>
                        <p className="text-sm">Make your first deposit to see activity here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">Your Savings Goals</h3>
                  <button 
                    onClick={handleAddGoal} 
                    className="bg-green-500 text-black px-4 py-2 rounded-md text-sm hover:bg-green-600"
                  >
                    + Create Goal
                  </button>
                </div>
                
                {goals.length === 0 ? (
                  <div className="text-center py-12 text-gray-300">
                    <PiggyBank className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-lg text-white mb-2">No savings goals created</p>
                    <p className="text-sm">Click "Create Goal" to get started</p>
                  </div>
                ) : (
                  goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`p-4 rounded-lg mb-3 ${
                        goal.progress >= 100 
                          ? 'bg-green-900 border-2 border-green-500' 
                          : 'bg-gray-800 border border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className={`font-medium mb-1 ${
                            goal.progress >= 100 ? 'text-green-400' : 'text-white'
                          }`}>
                            {goal.title} {goal.progress >= 100 && '🎉'}
                          </div>
                          <div className="text-sm text-gray-300">
                            ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          <button 
                            onClick={() => handleDeleteGoal(goal.id)} 
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                          <span className="text-white">
                            {Math.round(goal.progress)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-lg mb-3">
                        <div 
                          className={`h-2 rounded-lg ${
                            goal.progress >= 100 ? 'bg-green-400' : 'bg-green-500'
                          }`} 
                          style={{ width: `${Math.min(100, goal.progress)}%` }} 
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAddToGoal(goal)} 
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                            goal.progress >= 100 
                              ? 'bg-green-700 text-white cursor-not-allowed' 
                              : 'bg-green-500 text-black hover:bg-green-600'
                          }`} 
                          disabled={dollarBalance === 0 || goal.progress >= 100}
                        >
                          {goal.progress >= 100 ? '🎉 COMPLETED' : '+ Add Money'}
                        </button>
                        <button 
                          onClick={() => handleWithdrawFromGoal(goal)} 
                          className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed" 
                          disabled={goal.current === 0}
                        >
                          - Withdraw
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 max-h-[calc(100vh-200px)] flex flex-col">
                <h3 className="text-white font-medium mb-4">
                  Transaction History ({transactions.length})
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-white">{tx.type}</div>
                            {tx.goal && (
                              <div className="text-sm text-gray-300">Goal: {tx.goal}</div>
                            )}
                            <div className="text-xs text-gray-400">{tx.date}</div>
                          </div>
                          <span className={`text-lg font-bold ${
                            tx.type.includes("Deposit") || tx.type === "Goal Deposit" 
                              ? "text-green-400" 
                              : "text-red-400"
                          }`}>
                            {tx.type.includes("Deposit") ? "+" : "-"}${(tx.amount || 0).toFixed(2)}
                          </span>
                        </div>
                        {tx.signature && (
                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs text-gray-300">Tx ID:</span>
                            <button 
                              onClick={() => copyToClipboard(tx.signature!)}
                              className="text-xs bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600 transition"
                            >
                              {tx.signature.slice(0, 8)}...
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-300 py-8">
                      <History className="mx-auto mb-4 text-gray-500" size={48} />
                      <p className="text-lg text-white mb-2">No transactions yet</p>
                      <p className="text-sm">Your activity will appear here once you start depositing, withdrawing, or managing goals</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
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
                        <AiOutlineEdit 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" 
                          size={18} 
                        />
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
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-black font-semibold text-lg">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-xl">{userName}</p>
                          <p className="text-gray-300 text-sm">Your display name</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleNameEdit} 
                        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                      >
                        <AiOutlineEdit size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <AiOutlineUser size={20} /> Wallet
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-300">Address</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-white">
                          {publicKey!.toBase58().slice(0, 4)}...{publicKey!.toBase58().slice(-4)}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(publicKey!.toBase58())}
                          className="p-1 text-gray-300 hover:text-green-400"
                        >
                          <AiOutlineCopy size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-300">Status</span>
                      <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Total Balance</span>
                      <span className="text-white font-medium">
                        ${dollarBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
                  >
                    <AiOutlineLogout size={18} /> Logout
                  </button>
                </div>
              </div>
            )}

            {/* MODALS */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className={`bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md ${
                  showModal === 'addGoal' ? 'max-w-lg' : ''
                }`}>
                  <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      {showModal === 'deposit' && <AiOutlineCheckCircle className="text-green-400" size={20} />}
                      {showModal === 'withdraw' && <AiOutlineClose className="text-red-400" size={20} />}
                      {showModal === 'addGoal' && <AiOutlinePlus className="text-green-400" size={20} />}
                      {showModal === 'addToGoal' && <AiOutlineCheckCircle className="text-green-400" size={20} />}
                      {showModal === 'withdrawGoal' && <AiOutlineClose className="text-red-400" size={20} />}
                      
                      <h3 className="text-xl font-semibold text-white">
                        {showModal === 'deposit' && 'Add Money'}
                        {showModal === 'withdraw' && 'Withdraw to Wallet'}
                        {showModal === 'addGoal' && 'Create New Goal'}
                        {showModal === 'addToGoal' && `Add to ${currentGoal?.title}`}
                        {showModal === 'withdrawGoal' && `Withdraw from ${currentGoal?.title}`}
                      </h3>
                    </div>
                    <button 
                      onClick={() => { 
                        setShowModal(null); 
                        setAmount(""); 
                        setGoalTitle(""); 
                        setGoalTarget(""); 
                      }} 
                      className="p-1 text-gray-300 hover:text-white"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>

                  <div className="p-6">
                    {showModal === 'addGoal' ? (
                      <>
                        <input 
                          type="text" 
                          value={goalTitle} 
                          onChange={(e) => setGoalTitle(e.target.value)} 
                          placeholder="Goal name (e.g. Emergency Fund)" 
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                        <input 
                          type="number" 
                          step="0.01"
                          value={goalTarget} 
                          onChange={(e) => setGoalTarget(e.target.value)} 
                          placeholder="Target amount (USDT)" 
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-gray-300 mb-2">
                          {showModal === 'deposit' && `Available: $${dollarBalance.toFixed(2)}`}
                          {showModal === 'withdraw' && `Available: $${dollarBalance.toFixed(2)}`}
                          {showModal === 'addToGoal' && currentGoal && `Wallet: $${dollarBalance.toFixed(2)} | Remaining: $${(currentGoal.target - currentGoal.current).toFixed(2)}`}
                          {showModal === 'withdrawGoal' && currentGoal && `Available: $${currentGoal.current.toFixed(2)}`}
                        </div>
                        
                        <div className="relative mb-3">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">$</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="0.00" 
                            className="w-full bg-gray-800 text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl" 
                          />
                        </div>

                        {amount && (
                          <div className="text-sm text-gray-300 text-center mb-6">
                            = ₦{nairaPreview.toLocaleString()}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                    <button 
                      onClick={() => { 
                        setShowModal(null); 
                        setAmount(""); 
                        setGoalTitle(""); 
                        setGoalTarget(""); 
                      }} 
                      className="px-6 py-2 text-gray-300 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={showModal === 'addGoal' ? submitGoal : submitAmount} 
                      disabled={showModal === 'addGoal' ? isAddGoalDisabled : isAmountDisabled} 
                      className="px-6 py-2 bg-green-500 text-black font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition"
                    >
                      {showModal === 'addGoal' ? 'Create Goal' : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS NOTIFICATION */}
            {showSuccess && (
              <div className="fixed top-4 right-4 z-50">
                <div className="bg-green-900 border-2 border-green-500 rounded-xl p-4 text-white max-w-sm animate-in slide-in-from-right">
                  <AiOutlineCheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                  <p className="text-sm font-medium text-center whitespace-pre-line">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

            {/* ERROR NOTIFICATION */}
            {showError && (
              <div className="fixed top-4 right-4 z-50">
                <div className="bg-red-900 border-2 border-red-500 rounded-xl p-4 text-white max-w-sm animate-in slide-in-from-right">
                  <AiOutlineClose className="text-red-400 mx-auto mb-2" size={24} />
                  <p className="text-sm font-medium text-center whitespace-pre-line">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}