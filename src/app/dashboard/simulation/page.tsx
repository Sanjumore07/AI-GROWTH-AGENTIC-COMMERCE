"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlayCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Bot,
  TrendingUp,
  RotateCcw,
  Zap,
  Send,
  Eye,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function SimulationEnginePage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [recoveredData, setRecoveredData] = useState<any>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleStep1Intent = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "HERO_RECOVERY", step: "INTENT_SEARCH" }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`Shopper query: "${data.query}"`);
        addLog(`Intent Agent score: ${data.intent.intentScore}/100. Category: ${data.intent.category}, Budget: ₹${data.intent.budget}`);
        addLog(`Discovery Agent shortlisted: ${data.topRecommendation.name} as BEST_MATCH (${data.topRecommendation.matchScore}% score)`);
        setCurrentStep(1);
      }
    } catch (e) {
      addLog("Step 1 execution error");
    } finally {
      setRunning(false);
    }
  };

  const handleStep2Abandon = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "HERO_RECOVERY", step: "ABANDON_CART" }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`Shopper added item to cart (Total: ${formatINR(data.cartValue)}) and closed tab at checkout.`);
        addLog(`Cart Recovery Agent detected abandonment risk: ${data.risk}. Intent: ${data.intentScore}/100.`);
        addLog(`AI Decision: ${data.decision}. Reason: ${data.reasoning}`);
        setCurrentStep(2);
      }
    } catch (e) {
      addLog("Step 2 execution error");
    } finally {
      setRunning(false);
    }
  };

  const handleStep3Recover = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "HERO_RECOVERY", step: "EXECUTE_RECOVERY" }),
      });
      const data = await res.json();
      if (data.success) {
        setRecoveredData(data);
        addLog(`Customer Rahul Sharma opened AI reminder notification and returned to checkout.`);
        addLog(`Simulated Razorpay UPI payment verified. Created Order #${data.orderId.slice(-6)}.`);
        addLog(`REVENUE RECOVERED: ${formatINR(data.recoveredAmount)} added to AI-Attributed GMV!`);
        setCurrentStep(3);
      }
    } catch (e) {
      addLog("Step 3 recovery execution error");
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setLogs([]);
    setRecoveredData(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Buildathon Demo Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hero Demo Simulation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Execute the complete end-to-end autonomous commerce lifecycle with measurable revenue impact and live database mutations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Scenario</span>
        </button>
      </div>

      {/* Interactive Step-by-Step Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Scenario: Rahul Sharma (From Intent to ₹74,999 Purchase)
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Autonomous Margin-Guarding Recovery Flow
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className={`px-2 py-0.5 rounded ${currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>1. Intent</span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded ${currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>2. Abandon</span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded ${currentStep >= 3 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-500"}`}>3. Recover</span>
          </div>
        </div>

        {/* Step Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${currentStep === 0 ? "bg-indigo-950/40 border-indigo-500/60 shadow-glow" : currentStep > 0 ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-900/40 border-slate-800"}`}>
            <div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">STEP 1</span>
              <h3 className="text-sm font-semibold text-white mt-1">Express Intent & Discover</h3>
              <p className="text-xs text-slate-400 mt-1">
                Rahul queries: "I need a laptop for coding under ₹80,000". AI extracts intent & ranks Zenith Pro 16.
              </p>
            </div>
            <button
              onClick={handleStep1Intent}
              disabled={running || currentStep !== 0}
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Simulate Search & Ranking</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${currentStep === 1 ? "bg-indigo-950/40 border-indigo-500/60 shadow-glow" : currentStep > 1 ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-900/40 border-slate-800"}`}>
            <div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">STEP 2</span>
              <h3 className="text-sm font-semibold text-white mt-1">Add to Cart & Abandon</h3>
              <p className="text-xs text-slate-400 mt-1">
                Rahul adds ₹74,999 laptop, leaves at checkout. AI analyzes risk and chooses zero-discount reminder.
              </p>
            </div>
            <button
              onClick={handleStep2Abandon}
              disabled={running || currentStep !== 1}
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Simulate Cart Drop-off</span>
            </button>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${currentStep === 2 ? "bg-emerald-950/40 border-emerald-500/60 shadow-glow" : currentStep > 2 ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-900/40 border-slate-800"}`}>
            <div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">STEP 3 (HERO WOW)</span>
              <h3 className="text-sm font-semibold text-white mt-1">Autonomous Recovery</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispatches stock urgency nudge. Rahul returns & completes purchase via simulated Razorpay UPI!
              </p>
            </div>
            <button
              onClick={handleStep3Recover}
              disabled={running || currentStep !== 2}
              className="mt-4 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Recovery (₹74,999)</span>
            </button>
          </div>
        </div>

        {/* Success Reveal Banner */}
        {recoveredData && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500 text-emerald-200 text-xs sm:text-sm space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Hero Flow Completed: +₹74,999 Recovered into Attributed GMV!</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Order #{recoveredData.orderId.slice(-6)} has been created in the database. Customer profile updated, Cart Recovery Agent revenue incremented, transparent Decision Trace recorded, and executive dashboard metrics updated.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Updated Dashboard Metrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/orders"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                View Converted Order
              </Link>
            </div>
          </div>
        )}

        {/* Live Execution Telemetry Terminal */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto">
          <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800 flex justify-between">
            <span>TERMINAL TELEMETRY FEED</span>
            <span>STATUS: {running ? "PROCESSING..." : "READY"}</span>
          </div>
          {logs.length === 0 ? (
            <p className="text-slate-600 py-3">Click Step 1 above to begin the live hero simulation sequence...</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log.includes("REVENUE RECOVERED") ? (
                  <span className="text-emerald-400 font-bold">{log}</span>
                ) : log.includes("AI Decision") ? (
                  <span className="text-indigo-400">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
