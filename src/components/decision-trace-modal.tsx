"use client";

import { useEffect, useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDown,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export interface DecisionTraceData {
  id: string;
  agentKey: string;
  eventType: string;
  customer?: { name: string; email: string };
  contextJson: string;
  intentScore?: number;
  riskLevel?: string;
  optionsConsideredJson: string;
  decision: string;
  confidence: number;
  reasoning: string;
  status: string;
  outcome?: string;
  revenueImpact?: number;
  timestamp: string;
}

interface DecisionTraceModalProps {
  decision: DecisionTraceData | null;
  onClose: () => void;
}

export function DecisionTraceModal({ decision, onClose }: DecisionTraceModalProps) {
  if (!decision) return null;

  let contextObj: any = {};
  let optionsList: string[] = [];

  try {
    contextObj = JSON.parse(decision.contextJson || "{}");
  } catch (e) {}

  try {
    optionsList = JSON.parse(decision.optionsConsideredJson || "[]");
  } catch (e) {}

  const confidencePercent = Math.round(decision.confidence * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">AI Decision Trace</h3>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {decision.agentKey} AGENT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trace ID: {decision.id} • {new Date(decision.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Flow */}
        <div className="mt-6 space-y-4">
          {/* Step 1: Event */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              1. Observed Commerce Event
            </span>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {contextObj.event || decision.eventType}
            </p>
            {contextObj.details && (
              <p className="mt-1 text-xs text-slate-400">{contextObj.details}</p>
            )}
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 2: Context Snapshot */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customer Context
              </span>
              <p className="mt-1 text-sm text-slate-200 font-medium">
                {decision.customer?.name || "Target Shopper"}
              </p>
              {contextObj.cartValue && (
                <p className="text-xs text-slate-400">
                  Cart Value: {formatINR(contextObj.cartValue)}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Intent & Risk Metrics
              </span>
              <div className="mt-1 flex items-center gap-3">
                <div>
                  <span className="text-xs text-slate-400">Intent:</span>
                  <span className="ml-1 text-sm font-semibold text-emerald-400">
                    {decision.intentScore || 85}/100
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Risk:</span>
                  <span
                    className={`ml-1 text-xs font-semibold px-1.5 py-0.5 rounded ${
                      decision.riskLevel === "High"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {decision.riskLevel || "Low"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3: Candidate Options Evaluated */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Evaluated Candidate Options
            </span>
            <div className="mt-2 space-y-1.5">
              {optionsList.length > 0 ? (
                optionsList.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-800"
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Standard strategy suite evaluated</p>
              )}
            </div>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 4: Final Autonomous Decision */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Selected Autonomous Action
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>{confidencePercent}% Confidence</span>
              </div>
            </div>
            <p className="mt-2 text-base font-semibold text-white">{decision.decision}</p>
            <div className="mt-2.5 pt-2.5 border-t border-indigo-900/50 text-xs text-indigo-200/90 leading-relaxed">
              <span className="font-semibold text-indigo-300">Agent Reasoning: </span>
              {decision.reasoning}
            </div>
          </div>

          {/* Step 5: Outcome & Revenue Attribution */}
          {decision.outcome && (
            <>
              <div className="flex justify-center text-slate-600">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Recorded Outcome & Revenue Impact
                  </span>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {decision.outcome}
                  </p>
                  {decision.revenueImpact && decision.revenueImpact > 0 ? (
                    <p className="text-xs font-semibold text-emerald-400 mt-1">
                      + {formatINR(decision.revenueImpact)} AI-Attributed GMV
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors"
          >
            Close Decision Trace
          </button>
        </div>
      </div>
    </div>
  );
}
