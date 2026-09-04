"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Sparkles,
  AlertTriangle,
  Send,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

export default function HumanApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/approvals");
      const data = await res.json();
      if (data.approvals) setApprovals(data.approvals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleAction = async (decisionId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`Decision #${decisionId.slice(-6)} successfully ${action === "APPROVE" ? "Approved & Executed" : "Rejected"}!`);
        setTimeout(() => setActionSuccessMsg(""), 4000);
        loadApprovals();
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pending Merchant Approvals ({approvals.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Autonomous agents escalate actions when cart value exceeds thresholds or when proposed discounts require commercial authorization.
          </p>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Checking pending decision queue...
        </div>
      ) : approvals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">All Clear — No Pending Approvals</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Autonomous agents are executing within pre-approved merchant autonomy boundaries. Any escalated high-impact action will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {approvals.map((app) => {
            let contextObj: any = {};
            try {
              contextObj = JSON.parse(app.contextJson || "{}");
            } catch (e) {}

            return (
              <div
                key={app.id}
                className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      {app.agentKey} AGENT
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-300 font-medium">
                      Target: {app.customer?.name || "Shopper"}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(app.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Confidence:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {Math.round(app.confidence * 100)}%
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Needs Approval
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  {/* Proposal */}
                  <div className="lg:col-span-2 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Proposed Autonomous Action
                      </span>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {app.decision}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        AI Reasoning & Risk Assessment
                      </span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">
                        {app.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Context Snapshot */}
                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Context Snapshot
                    </span>
                    <div className="space-y-1 text-slate-300">
                      {contextObj.cartValue && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cart Total:</span>
                          <span className="font-semibold text-white">{formatINR(contextObj.cartValue)}</span>
                        </div>
                      )}
                      {contextObj.customerSegment && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Customer Segment:</span>
                          <span>{contextObj.customerSegment}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Intent Score:</span>
                        <span className="text-emerald-400 font-semibold">{app.intentScore || 85}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDecision(app)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Full Decision Trace</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(app.id, "REJECT")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Reject Proposal</span>
                    </button>

                    <button
                      onClick={() => handleAction(app.id, "APPROVE")}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Execute</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DecisionTraceModal
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
