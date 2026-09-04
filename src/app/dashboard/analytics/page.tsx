"use client";

import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatINR, formatCompactINR } from "@/lib/utils";

const funnelData = [
  { step: "1. Store Visitors", count: 24800, dropoff: "26.6%" },
  { step: "2. Product Views", count: 18200, dropoff: "52.7%" },
  { step: "3. AI Interaction", count: 8600, dropoff: "60.4%" },
  { step: "4. Added to Cart", count: 3400, dropoff: "45.8%" },
  { step: "5. Checkout Start", count: 1840, dropoff: "35.3%" },
  { step: "6. Purchase Completed", count: 1190, dropoff: "0%" },
];

export default function AnalyticsDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Funnel Attribution Telemetry</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Conversion Funnel & AI Impact Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Empirically grounded conversion rates, drop-off analysis, and AI multiplier benchmarks.
        </p>
      </div>

      {/* AI Uplift Highlight Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Conversion Multiplier
          </span>
          <div className="mt-1 text-3xl font-extrabold text-white">2.3× Uplift</div>
          <p className="text-xs text-slate-300 mt-1">
            Shoppers interacting with the AI Shopping Assistant convert 2.3× more frequently than traditional passive browsing.
          </p>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Cart Recovery Rate
          </span>
          <div className="mt-1 text-3xl font-extrabold text-white">28.4%</div>
          <p className="text-xs text-slate-300 mt-1">
            Margin-guarding personalized nudges recovered ₹1.84L without unnecessary discount dilution.
          </p>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Average Order Value Lift
          </span>
          <div className="mt-1 text-3xl font-extrabold text-white">+₹3,420 AOV</div>
          <p className="text-xs text-slate-300 mt-1">
            Smart complementary accessory pairings raised checkout baskets by 18.2%.
          </p>
        </div>
      </div>

      {/* Funnel Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Storefront Conversion Funnel</h3>
            <p className="text-xs text-slate-400">From initial discovery through completed Razorpay payment</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            End-to-End Conversion: 4.80%
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 30, top: 10, bottom: 10 }}>
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => v.toLocaleString()} />
              <YAxis dataKey="step" type="category" stroke="#cbd5e1" fontSize={12} width={150} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px", color: "#f8fafc" }}
                formatter={(val: any) => [val.toLocaleString() + " Users", "Volume"]}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 5 ? "#10b981" : index >= 2 ? "#6366f1" : "#475569"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Steps Breakdown Table */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4 border-t border-slate-800 text-xs">
          {funnelData.map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <span className="text-slate-400 text-[11px] block truncate">{f.step}</span>
              <div className="text-sm font-bold text-white mt-1">{f.count.toLocaleString()}</div>
              {f.dropoff !== "0%" && (
                <span className="text-[10px] text-rose-400 block mt-0.5">-{f.dropoff} drop</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
