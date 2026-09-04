"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function OrdersManagerPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchesQ =
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(query.toLowerCase());

    if (filterType === "AI_ONLY") return matchesQ && o.isAiInfluenced;
    if (filterType === "RECOVERED") return matchesQ && o.aiInfluenceType === "RECOVERED_CART";
    return matchesQ;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Revenue Attribution Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Completed Orders ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit trail of customer purchases with AI influence tags and Razorpay simulation verifications.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "AI_ONLY", label: "AI Influenced Only" },
            { id: "RECOVERED", label: "Recovered Carts Only" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filterType === f.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order #</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">AI Attribution</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading orders ledger...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-mono font-semibold text-indigo-400">
                      #{o.orderNumber}
                    </td>

                    <td className="py-3.5">
                      <div className="font-semibold text-white">{o.customer?.name}</div>
                      <div className="text-[11px] text-slate-500">{o.customer?.email}</div>
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 font-semibold text-white">
                      {formatINR(o.total)}
                    </td>

                    <td className="py-3.5 text-slate-300">
                      <span className="truncate max-w-[140px] block">{o.paymentMethod}</span>
                    </td>

                    <td className="py-3.5">
                      {o.isAiInfluenced ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.aiInfluenceType === "RECOVERED_CART"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}
                        >
                          {o.aiInfluenceType?.replace(/_/g, " ") || "AI INFLUENCED"}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Direct Store</span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
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
