"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Bot,
  TrendingUp,
  ShoppingCart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  BarChart3,
  Search,
  Eye,
  Store,
  LayoutDashboard,
} from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">CommercePilot AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
          <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
          <a href="#agents" className="hover:text-white transition-colors">AI Agents</a>
          <a href="#journey" className="hover:text-white transition-colors">How It Works</a>
          <a href="#impact" className="hover:text-white transition-colors">Business Impact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/store"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storefront</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Track 1: AI Growth & Agentic Commerce • Razorpay AI Buildathon</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Commerce that <br />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            thinks ahead.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          From customer intent to completed purchase — autonomously. CommercePilot orchestrates 10 specialized AI agents to observe shopper intent, personalize recommendations, preserve margins, and recover revenue.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Launch Merchant Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/store"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Experience Shopper Store</span>
          </Link>

          <Link
            href="/dashboard/simulation"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 font-semibold text-sm border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Hero Simulation (Rahul Sharma)</span>
          </Link>
        </div>

        {/* Live Commerce Journey Diagram */}
        <div id="journey" className="pt-14">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">The Autonomous Operating Loop</span>
                <h3 className="text-base font-bold text-white">How CommercePilot Converts Intent into Growth</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">100% Grounded in Merchant Catalog</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs text-left">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-indigo-400 font-bold block">1. INTENT</span>
                <p className="text-slate-300 mt-1">Natural language query & constraints</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-indigo-400 font-bold block">2. DISCOVERY</span>
                <p className="text-slate-300 mt-1">Budget-strict catalog re-ranking</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-indigo-400 font-bold block">3. ADVISOR</span>
                <p className="text-slate-300 mt-1">Grounded Q&A & specs comparison</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-indigo-400 font-bold block">4. SMART CART</span>
                <p className="text-slate-300 mt-1">Proactive companion bundling</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-emerald-400 font-bold block">5. RECOVERY</span>
                <p className="text-slate-300 mt-1">Margin-preserving stock nudges</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-purple-400 font-bold block">6. RETENTION</span>
                <p className="text-slate-300 mt-1">Post-purchase repeat nurturing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Strategic Paradigm Shift</span>
            <h2 className="text-3xl font-extrabold text-white">Traditional Commerce vs Autonomous Agentic Commerce</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Traditional Passive Commerce</span>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Waits passively for customers to formulate keywords and filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Blindly blasts 15-20% margin-diluting discount coupons on every drop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Generic chatbots that hallucinate specs without real catalog grounding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Static dashboards showing historical losses with no proactive actions</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CommercePilot Agentic Operating Layer</span>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Understands unstructured natural language intent, budgets, and constraints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Evaluates purchase intent score (0-100) and preserves gross margins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Transparent Decision Traces with clear confidence metrics and audit trail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Merchant Autonomy Policies (Suggest Only, Approval Required, Auto Execute)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Autonomous Agents Section */}
      <section id="agents" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Specialized Intelligence</span>
          <h2 className="text-3xl font-extrabold text-white">The 10 Specialized Commerce Agents</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Not a monolithic generic bot, but a coordinated swarm of purpose-built fintech and retail agents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: "INTENT", name: "Shopping Intent Agent", desc: "Extracts category, hard budget, and priority specs from shopper phrasing." },
            { key: "DISCOVERY", name: "Product Discovery Agent", desc: "Ranks Best Match, Best Value, Budget Pick, and Premium Choice with reasoning." },
            { key: "ADVISOR", name: "Commerce Advisor Agent", desc: "Answers product suitability, specs comparison, and student/workplace questions." },
            { key: "PERSONALIZATION", name: "Personalization Agent", desc: "Aggregates browse sequences to build Customer 360 profiles and price sensitivity." },
            { key: "OFFER", name: "Offer Optimization Agent", desc: "Determines if incentives are strictly needed; guards merchant gross margin." },
            { key: "RECOVERY", name: "Cart Recovery Agent", desc: "Intercepts abandoned carts with personalized stock urgency nudges." },
            { key: "UPSELL", name: "Upsell & Cross-Sell Agent", desc: "Pairs contextually verified peripherals (laptops with hubs & sleeves)." },
            { key: "RETENTION", name: "Customer Retention Agent", desc: "Schedules post-purchase onboarding guides and replenishment cycles." },
            { key: "GROWTH", name: "Growth Insights Agent", desc: "Analyzes funnel telemetry to detect checkout friction and margin expansion." },
          ].map((a) => (
            <div key={a.key} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">{a.key}</span>
                <span className="flex h-2 w-2 relative">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{a.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Impact Section */}
      <section id="impact" className="py-20 px-6 lg:px-12 bg-slate-900/60 border-t border-slate-850 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Measurable ROI</span>
            <h2 className="text-3xl font-extrabold text-white">Built for Tangible Merchant Growth</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400">2.3×</div>
              <span className="text-xs text-slate-400 mt-1 block">Conversion Uplift</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">+31.2%</div>
              <span className="text-xs text-slate-400 mt-1 block">AI-Attributed GMV</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-white">₹1.84L</div>
              <span className="text-xs text-slate-400 mt-1 block">Recovered Cart GMV</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">0%</div>
              <span className="text-xs text-slate-400 mt-1 block">Wasted Discounts</span>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all"
            >
              <span>Explore the Live Application Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
