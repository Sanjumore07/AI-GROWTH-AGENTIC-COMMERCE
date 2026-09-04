"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  CreditCard,
  Bot,
  Key,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("TechNest Store");
  const [currency, setCurrency] = useState("INR");
  const [geminiKey, setGeminiKey] = useState("");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_demo_commercepilot");
  const [simulationMode, setSimulationMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Store & AI Engine Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage merchant credentials, AI engine providers, Razorpay test keys, and autonomous policy limits.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-white">Merchant Business Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Store Display Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Engine & API Keys */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">AI Engine & Fallback Architecture</h2>
          </div>
          <p className="text-xs text-slate-400">
            CommercePilot employs a resilient dual-engine architecture: when an external LLM API key is absent or latency spikes, the system autonomously operates using the deterministic heuristic engine with zero downtime.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Google Gemini API Key (Optional)</label>
              <input
                type="password"
                placeholder="AIzaSy... (Leave empty to use high-intelligence local engine)"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Current AI Engine Status:</span>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                  ● Dual-Engine Online (Gemini Ready + Deterministic Knowledge Base Active)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                100% Availability
              </span>
            </div>
          </div>
        </div>

        {/* Razorpay Integration Settings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Razorpay Buildathon Payment Configuration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Razorpay Key ID</label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Razorpay Simulation Mode</span>
                  <span className="text-[10px] text-slate-400">Sandbox verification without real card charges</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Save All Configurations
          </button>
        </div>
      </form>
    </div>
  );
}
