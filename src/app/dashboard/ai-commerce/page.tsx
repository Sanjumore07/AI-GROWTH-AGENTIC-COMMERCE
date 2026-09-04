"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
  ChevronRight,
  Eye,
  Sliders,
  AlertCircle,
} from "lucide-react";
import { formatINR, formatCompactINR } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

interface AgentItem {
  id: string;
  key: string;
  name: string;
  role: string;
  description: string;
  status: string;
  autonomyLevel: string;
  confidenceThreshold: number;
  totalExecutions: number;
  successfulActions: number;
  revenueInfluenced: number;
  successRate: number;
  fallbackRate: number;
  avgLatencyMs: number;
}

export default function AICommerceCommandCenter() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionTraceData[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);
  const [filterAgent, setFilterAgent] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        if (data.agents) setAgents(data.agents);
      })
      .catch(() => {});

    fetch("/api/decisions")
      .then((r) => r.json())
      .then((data) => {
        if (data.decisions) setDecisions(data.decisions);
      })
      .catch(() => {});
  }, []);

  const filteredDecisions = filterAgent === "ALL"
    ? decisions
    : decisions.filter((d) => d.agentKey === filterAgent);

  const totalDecisions = agents.reduce((acc, a) => acc + a.totalExecutions, 0) || 1420;
  const successfulActions = agents.reduce((acc, a) => acc + a.successfulActions, 0) || 1368;
  const totalRevenueInfluenced = agents.reduce((acc, a) => acc + a.revenueInfluenced, 0) || 3725525;

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Agent Swarm Orchestration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Commerce Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status, execution metrics, autonomy policies, and telemetry across all 10 specialized commerce agents.
          </p>
        </div>

        <Link
          href="/dashboard/simulation"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-colors"
        >
          <Activity className="w-4 h-4" />
          <span>Interactive Simulation</span>
        </Link>
      </div>

      {/* Top AI Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">AI Decisions Today</span>
          <div className="mt-1 text-2xl font-bold text-white">{totalDecisions.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-emerald-400 font-semibold">+14.2% vs yesterday</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Successful AI Actions</span>
          <div className="mt-1 text-2xl font-bold text-white">{successfulActions.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            {((successfulActions / (totalDecisions || 1)) * 100).toFixed(1)}% success execution rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Revenue Influenced</span>
          <div className="mt-1 text-2xl font-bold text-indigo-300">
            {formatCompactINR(totalRevenueInfluenced)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400 font-semibold">+31.2% this period</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Average Confidence</span>
          <div className="mt-1 text-2xl font-bold text-white">94.2%</div>
          <p className="mt-1 text-[11px] text-slate-400">Fallback Rate: 3.8%</p>
        </div>
      </div>

      {/* 10 Autonomous Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Active AI Agents ({agents.length})</h2>
          <span className="text-xs text-slate-400">Click any agent to configure autonomy and thresholds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.key}`}
              className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {agent.key}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      agent.autonomyLevel === "AUTO_EXECUTE"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : agent.autonomyLevel === "APPROVAL_REQUIRED"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {agent.autonomyLevel.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {agent.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Success Rate</span>
                  <span className="font-semibold text-slate-200">{agent.successRate}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Revenue Attrib.</span>
                  <span className="font-semibold text-indigo-300">
                    {formatCompactINR(agent.revenueInfluenced)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Latency</span>
                  <span className="font-semibold text-slate-400">{agent.avgLatencyMs}ms</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live AI Decision Stream Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Transparent Autonomous Decision Stream</h3>
            <p className="text-xs text-slate-400">
              Every critical action contains full reasoning, options evaluated, and risk scores.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {["ALL", "RECOVERY", "OFFER", "DISCOVERY", "UPSELL", "INTENT"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterAgent(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterAgent === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-800/60">
          {filteredDecisions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No decisions recorded for selected filter.
            </div>
          ) : (
            filteredDecisions.slice(0, 10).map((d) => (
              <div key={d.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 px-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-300">
                        {d.agentKey} AGENT
                      </span>
                      <span className="text-slate-500 text-[11px]">•</span>
                      <span className="text-xs text-slate-400">
                        Target: {d.customer?.name || "Shopper"}
                      </span>
                      <span className="text-slate-500 text-[11px]">•</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(d.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-200 mt-1">
                      {d.decision}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      Reasoning: {d.reasoning}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Confidence</span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {Math.round(d.confidence * 100)}%
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedDecision(d)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Trace</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DecisionTraceModal
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
