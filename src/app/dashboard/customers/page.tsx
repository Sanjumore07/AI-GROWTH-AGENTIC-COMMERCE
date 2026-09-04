"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Shield,
  Sparkles,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function CustomersDirectoryPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/search?q=a") // or fetch customers
      .catch(() => {});
    // Let's fetch customers from /api/customers
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const matchesQ =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase());
    const matchesSeg = selectedSegment === "ALL" || c.segment === selectedSegment;
    return matchesQ && matchesSeg;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer 360 Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time behavioral synthesis, price sensitivity profiling, and intent telemetry per customer.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {["ALL", "VIP Merchant", "High Intent", "Price Sensitive", "At Risk"].map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                selectedSegment === seg
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {seg}
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
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Segment</th>
                <th className="pb-3 font-semibold">Total Spend</th>
                <th className="pb-3 font-semibold">Orders</th>
                <th className="pb-3 font-semibold">AOV</th>
                <th className="pb-3 font-semibold">Purchase Prob.</th>
                <th className="pb-3 font-semibold">Churn Risk</th>
                <th className="pb-3 font-semibold text-right">360 View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No customers found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.email}</div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.segment === "VIP Merchant"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : c.segment === "High Intent"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : c.segment === "At Risk"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {c.segment}
                      </span>
                    </td>

                    <td className="py-3.5 font-semibold text-slate-200">
                      {formatINR(c.totalSpend)}
                    </td>

                    <td className="py-3.5 text-slate-300">{c.ordersCount}</td>

                    <td className="py-3.5 text-slate-300">
                      {formatINR(c.avgOrderValue)}
                    </td>

                    <td className="py-3.5 font-semibold text-emerald-400">
                      {Math.round(c.purchaseProbability * 100)}%
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.churnRisk === "High"
                            ? "bg-rose-500/20 text-rose-300"
                            : c.churnRisk === "Medium"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {c.churnRisk}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <Link
                        href={`/dashboard/customers/${c.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium transition-colors"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
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
