"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import { formatINR, formatCompactINR } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

export default function AgentDetailPage() {
  const params = useParams();
  const agentKey = (params.key as string)?.toUpperCase();

  const [agent, setAgent] = useState<any>(null);
  const [decisions, setDecisions] = useState<DecisionTraceData[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);
  const [autonomyLevel, setAutonomyLevel] = useState("AUTO_EXECUTE");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        if (data.agents) {
          const matched = data.agents.find((a: any) => a.key === agentKey);
          if (matched) {
            setAgent(matched);
            setAutonomyLevel(matched.autonomyLevel);
            setConfidenceThreshold(matched.confidenceThreshold);
          }
        }
      });

    fetch(`/api/decisions?agentKey=${agentKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.decisions) setDecisions(data.decisions);
      });
  }, [agentKey]);

  const handleSavePolicy = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: agentKey,
          autonomyLevel,
          confidenceThreshold: parseFloat(confidenceThreshold.toString()),
        }),
      });
      const data = await res.json();
      if (data.agent) {
        setAgent(data.agent);
        setSavedMsg("Autonomy policy and threshold updated successfully!");
        setTimeout(() => setSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update agent policy:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!agent) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading agent configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/ai-commerce"
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{agent.name}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              {agent.key}
            </span>
          </div>
          <p className="text-xs text-slate-400">{agent.role}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Policy Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Spec Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Mission & System Prompt Boundaries
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              {agent.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500">Model Provider</span>
                <p className="font-medium text-slate-200 mt-0.5">{agent.modelProvider}</p>
              </div>
              <div>
                <span className="text-slate-500">Runtime Latency</span>
                <p className="font-medium text-slate-200 mt-0.5">{agent.avgLatencyMs}ms average</p>
              </div>
              <div>
                <span className="text-slate-500">Execution Mode</span>
                <p className="font-medium text-emerald-400 mt-0.5">Continuous Active</p>
              </div>
            </div>
          </div>

          {/* Autonomy Controls Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Autonomy Governance & Thresholds</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Control whether this agent acts autonomously, proposes actions for merchant review, or suggests only.
              </p>
            </div>

            {/* Radio Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "SUGGEST_ONLY",
                  title: "Suggest Only",
                  desc: "Produces recommendations; never initiates storefront mutation.",
                },
                {
                  id: "APPROVAL_REQUIRED",
                  title: "Approval Required",
                  desc: "Flags high-value actions to Approvals Center before dispatch.",
                },
                {
                  id: "AUTO_EXECUTE",
                  title: "Auto Execute",
                  desc: "Fully autonomous execution when confidence exceeds threshold.",
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setAutonomyLevel(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    autonomyLevel === opt.id
                      ? "bg-indigo-950/60 border-indigo-500 text-white"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</div>
                </label>
              ))}
            </div>

            {/* Confidence Threshold Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Confidence Threshold</span>
                <span className="font-mono font-bold text-indigo-400">
                  {Math.round(confidenceThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Actions with confidence below {Math.round(confidenceThreshold * 100)}% will automatically escalate to human review or trigger deterministic fallback.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedMsg ? (
                <span className="text-xs font-semibold text-emerald-400">{savedMsg}</span>
              ) : <span />}

              <button
                onClick={handleSavePolicy}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? "Saving Policy..." : "Save Autonomy Policy"}
              </button>
            </div>
          </div>

          {/* Recent Decisions by this Agent */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-base font-semibold text-white mb-4">
              Historical Execution Decisions ({decisions.length})
            </h2>

            <div className="space-y-3">
              {decisions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No decisions logged for this agent yet.
                </div>
              ) : (
                decisions.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{new Date(d.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span className="text-indigo-400">Conf: {Math.round(d.confidence * 100)}%</span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 mt-1">{d.decision}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{d.reasoning}</div>
                    </div>

                    <button
                      onClick={() => setSelectedDecision(d)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-750 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      Trace
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Performance Telemetry */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Agent Telemetry
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-slate-400 text-xs">Total Executions</span>
                <div className="text-xl font-bold text-white mt-1">
                  {agent.totalExecutions.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-slate-400 text-xs">Revenue Influenced</span>
                <div className="text-xl font-bold text-indigo-300 mt-1">
                  {formatCompactINR(agent.revenueInfluenced)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-slate-400 text-xs">Success Rate</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {agent.successRate}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-slate-400 text-xs">Fallback Rate</span>
                <div className="text-xl font-bold text-amber-400 mt-1">
                  {agent.fallbackRate}%
                </div>
                <span className="text-[10px] text-slate-500">
                  Safely handled by heuristic engine
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DecisionTraceModal
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
