"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatedMap, setActivatedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data) => {
        if (data.insights) setInsights(data.insights);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (id: string) => {
    setActivatedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Business Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Growth Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Growth Opportunities synthesized by the Growth Insights Agent with transparent root cause analysis and 1-click execution.
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">
            Synthesizing storefront conversion telemetry...
          </div>
        ) : (
          insights.map((item) => {
            const isActivated = activatedMap[item.id];

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  item.priority === "HIGH"
                    ? "bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/40"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.priority === "HIGH"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : item.priority === "QUICK_WIN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {item.priority.replace("_", " ")} IMPACT
                    </span>

                    {isActivated && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Strategy Active</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Root Cause (WHY)
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.why}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        Projected Impact
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.impact}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium line-clamp-1 max-w-[240px]">
                    Action: {item.recommendedAction}
                  </span>

                  <button
                    onClick={() => handleAction(item.id)}
                    disabled={isActivated}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                      isActivated
                        ? "bg-slate-800 text-slate-500 cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isActivated ? "Activated" : item.actionButtonLabel || "Execute Action"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
