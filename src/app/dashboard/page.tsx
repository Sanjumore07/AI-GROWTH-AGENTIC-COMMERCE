"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Bot,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  PlayCircle,
  Eye,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR, formatCompactINR } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

const revenueTrend = [
  { day: "Day 1", total: 110000, aiAttributed: 65000 },
  { day: "Day 5", total: 240000, aiAttributed: 160000 },
  { day: "Day 10", total: 420000, aiAttributed: 310000 },
  { day: "Day 15", total: 690000, aiAttributed: 520000 },
  { day: "Day 20", total: 1120000, aiAttributed: 840000 },
  { day: "Day 25", total: 1640000, aiAttributed: 1220000 },
  { day: "Day 30", total: 2480000, aiAttributed: 1890000 },
];

export default function DashboardOverviewPage() {
  const [decisions, setDecisions] = useState<DecisionTraceData[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/decisions")
      .then((r) => r.json())
      .then((data) => {
        if (data.decisions) setDecisions(data.decisions.slice(0, 6));
      })
      .catch(() => {});

    fetch("/api/approvals")
      .then((r) => r.json())
      .then((data) => {
        if (data.approvals) setPendingApprovals(data.approvals);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Commerce Operational</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Commerce Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            10 specialized AI agents are continuously observing shopper intent, orchestrating catalog recommendations, and recapturing abandoned revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/simulation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-glow transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Run Hero Simulation</span>
          </Link>
          <Link
            href="/dashboard/ai-commerce"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Command Center</span>
          </Link>
        </div>
      </div>

      {/* Pending Approvals Callout (if any) */}
      {pendingApprovals.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white">
                {pendingApprovals.length} High-Value Action(s) Require Human Approval
              </span>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {pendingApprovals[0]?.decision} (Confidence: {Math.round(pendingApprovals[0]?.confidence * 100)}%)
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/approvals"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
          >
            <span>Review Actions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Gross GMV</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">₹51.6L</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Across 110 completed verified orders
          </p>
        </div>

        {/* Card 2: AI-Attributed Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-300">AI-Attributed Revenue</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              +31.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-200">₹37.2L</div>
          <p className="mt-1 text-[11px] text-indigo-300/70">
            72% of total storefront conversion
          </p>
        </div>

        {/* Card 3: Recovered Carts */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Recovered Cart GMV</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              +22.8% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">₹1.84L</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Via margin-guarding stock nudges
          </p>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Store Conversion Rate</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              4.8% (+0.7%)
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">4.8%</div>
          <p className="mt-1 text-[11px] text-slate-400">
            2.3× higher when AI Advisor engaged
          </p>
        </div>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & AI Impact Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Revenue & AI Attribution</h3>
                <p className="text-xs text-slate-400">Cumulative GMV versus Autonomous Agent Influence</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  <span className="text-slate-400">Total GMV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-indigo-300 font-medium">AI Influenced</span>
                </div>
              </div>
            </div>

            <div className="h-64 mt-6 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => formatCompactINR(val)}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                    formatter={(val: any) => [formatINR(val), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#totalGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="aiAttributed"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#aiGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs mt-4">
            <div>
              <span className="text-slate-400">Average Order Value</span>
              <div className="font-semibold text-white mt-0.5">₹46,900</div>
            </div>
            <div>
              <span className="text-slate-400">Repeat Orders (30D)</span>
              <div className="font-semibold text-emerald-400 mt-0.5">24.2% (+5.8%)</div>
            </div>
            <div>
              <span className="text-slate-400">Margin Preserved</span>
              <div className="font-semibold text-indigo-300 mt-0.5">₹3.42L (Zero Waste)</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live AI Decision Stream */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <h3 className="text-sm font-semibold text-white">Live AI Decision Stream</h3>
              </div>
              <Link
                href="/dashboard/activity"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Full Audit</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {decisions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Awaiting live agent events...
                </div>
              ) : (
                decisions.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-indigo-400 font-semibold">
                        {d.agentKey} AGENT
                      </span>
                      <span className="text-slate-500">
                        {new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium mt-1 line-clamp-1">
                      {d.decision}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-700/40">
                      <span className="text-slate-400">
                        Conf: <strong className="text-emerald-400">{Math.round(d.confidence * 100)}%</strong>
                      </span>
                      <button
                        onClick={() => setSelectedDecision(d)}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Trace</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/dashboard/ai-commerce"
            className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-xs font-medium text-slate-300 hover:text-white transition-colors block"
          >
            Explore AI Command Center →
          </Link>
        </div>
      </div>

      {/* Decision Trace Modal */}
      <DecisionTraceModal
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
