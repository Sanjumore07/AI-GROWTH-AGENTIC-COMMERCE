"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function ActivityAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>System Audit & Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Activity & Audit Log ({logs.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Chronological record of autonomous agent triggers, merchant human approvals, and operational mutations.
        </p>
      </div>

      {/* Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Actor / Agent</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Target Entity</th>
                <th className="pb-3 font-semibold">Outcome</th>
                <th className="pb-3 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No activity records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-800 text-indigo-400">
                          {log.agentKey ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-semibold text-white">{log.actor}</span>
                      </div>
                    </td>

                    <td className="py-3.5 font-medium text-slate-200 max-w-xs truncate">
                      {log.action}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {log.entityType ? `${log.entityType} #${(log.entityId || "").slice(-6)}` : "System"}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.outcome === "Success" || log.outcome === "Executed" || log.outcome === "Viewed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : log.outcome === "Approval Required"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {log.outcome}
                      </span>
                    </td>

                    <td className="py-3.5 text-right text-slate-400 max-w-xs truncate">
                      {log.details || "Completed successfully"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
