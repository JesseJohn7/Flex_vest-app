"use client";

import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Save,
  Lock,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Banknote,
  Upload,
  Trash2,
  LogOut,
} from "lucide-react";

export default function SettingsSection() {
  // Profile State
  const [name, setName] = useState("Jesse John");
  const [email, setEmail] = useState("jesse@example.com");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // Toggles
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");

  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("user-avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  // Avatar change
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const imgUrl = reader.result;
          setAvatar(imgUrl);
          localStorage.setItem("user-avatar", imgUrl); // persist
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setEditing(false);
    showSuccess("✅ Profile updated successfully!");
  };

  // Update password
  const handlePasswordUpdate = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showSuccess("⚠️ Passwords do not match!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showSuccess("✅ Password updated successfully!");
  };

  const showSuccess = (msg: SetStateAction<string>) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden cursor-pointer group">
          {avatar ? (
            <img src={avatar} alt="avatar" className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-black font-bold text-2xl">
              {name.charAt(0)}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition">
            <span className="text-xs">Change</span>
            <Upload size={16} />
          </div>

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Remove avatar */}
          {avatar && (
            <button
              onClick={() => {
                setAvatar(null);
                localStorage.removeItem("user-avatar");
              }}
              className="absolute top-0 right-0 bg-red-500/70 rounded-full p-1 text-white hover:bg-red-600 transition"
            >
              &times;
            </button>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">{name}</h2>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Profile Info</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
            >
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
            >
              <Save size={14} /> Save
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-transparent border border-white/20 focus:ring-2 focus:ring-green-400 text-sm text-white"
              />
            ) : (
              <p className="text-white font-medium mt-1">{name}</p>
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-transparent border border-white/20 focus:ring-2 focus:ring-green-400 text-sm text-white"
              />
            ) : (
              <p className="text-gray-300 mt-1">{email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-green-400" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border border-white/20 text-sm text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border border-white/20 text-sm text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border border-white/20 text-sm text-white focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
          >
            Update Password
          </button>
        </form>

        {/* 2FA Toggle */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-400" size={18} />
            <span className="text-sm text-gray-300">Two-Factor Auth</span>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`w-12 h-6 rounded-full ${twoFA ? "bg-green-500" : "bg-gray-600"} relative transition`}
          >
            <div
              className={`absolute top-0.5 ${twoFA ? "left-6" : "left-1"} bg-white w-5 h-5 rounded-full transition`}
            ></div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="text-green-400" size={18} />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full ${notifications ? "bg-green-500" : "bg-gray-600"} relative transition`}
          >
            <div
              className={`absolute top-0.5 ${notifications ? "left-6" : "left-1"} bg-white w-5 h-5 rounded-full transition`}
            ></div>
          </button>
        </div>
        <p className="text-sm text-gray-400">
          {notifications ? "You’ll receive savings and transaction alerts." : "Notifications are turned off."}
        </p>
      </div>

      {/* App Theme */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="text-green-400" size={18} /> : <Sun className="text-yellow-400" size={18} />}
            <h3 className="text-lg font-semibold text-white">App Theme</h3>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full ${darkMode ? "bg-green-500" : "bg-gray-600"} relative transition`}
          >
            <div
              className={`absolute top-0.5 ${darkMode ? "left-6" : "left-1"} bg-white w-5 h-5 rounded-full transition`}
            ></div>
          </button>
        </div>
      </div>

      {/* Linked Bank */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <div className="flex items-center gap-2 mb-3">
          <Banknote className="text-green-400" size={18} />
          <h3 className="text-lg font-semibold text-white">Linked Bank</h3>
        </div>
        <p className="text-sm text-gray-400">GTBank - **** 5623</p>
        <button className="mt-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-sm transition">
          Add New Bank
        </button>
      </div>

      {/* Legal */}
      <div className="p-4 sm:p-5 bg-[#151515]/80 rounded-lg hover:bg-[#1a1a1a]/90 transition">
        <h3 className="text-lg font-semibold text-white mb-2">About & Legal</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
          <li>Version 1.0.0</li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto transition">
          <Trash2 size={16} /> Delete Account
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto transition">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-green-400 text-sm font-semibold"
        >
          {success}
        </motion.div>
      )}
    </motion.div>
  );
}
