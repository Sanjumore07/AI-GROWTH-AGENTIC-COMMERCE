"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, Store } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@commercepilot.ai");
  const [password, setPassword] = useState("pilot2026");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleDemoLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white">CommercePilot</span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Sign in to Merchant Control
          </h1>
          <p className="text-xs text-slate-400">
            Monitor autonomous agent operations and revenue attribution.
          </p>
        </div>

        {/* 1-Click Demo Fast Track Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Razorpay Buildathon Fast-Track</span>
          </div>
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <span>Continue with Demo Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-slate-400">
            Pre-loaded with 110+ products, 55 customers, and active agent swarm
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Or Standard Login
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Merchant Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium">Password</label>
              <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            Sign In with Email
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Want to experience the consumer shopping journey?{" "}
          <Link href="/store" className="text-indigo-400 hover:underline font-semibold">
            Open Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
