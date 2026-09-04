"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { formatINR, formatRelativeTime } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);

  useEffect(() => {
    fetch(`/api/customers?id=${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.customer) setCustomer(data.customer);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Loading Customer 360 profile...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-20 text-center text-slate-400">
        Customer not found.
      </div>
    );
  }

  let prefs: any = {};
  try {
    prefs = JSON.parse(customer.preferences || "{}");
  } catch (e) {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/customers"
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{customer.name}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              {customer.segment}
            </span>
          </div>
          <p className="text-xs text-slate-400">{customer.email} • {customer.phone || "No phone on file"}</p>
        </div>
      </div>

      {/* Top Profile Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Lifetime Spend</span>
          <div className="text-xl font-bold text-white mt-1">{formatINR(customer.totalSpend)}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{customer.ordersCount} Completed Orders</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Average Order Value (AOV)</span>
          <div className="text-xl font-bold text-white mt-1">{formatINR(customer.avgOrderValue)}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Price Sensitivity: {customer.priceSensitivity}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Purchase Probability</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {Math.round(customer.purchaseProbability * 100)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">High Conversion Likelihood</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Churn Risk Profile</span>
          <div className="text-xl font-bold text-slate-200 mt-1">{customer.churnRisk}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Last Active: {formatRelativeTime(customer.lastActiveAt)}</p>
        </div>
      </div>

      {/* AI Behavioral Synthesis Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white">
            AI Behavioral Synthesis & Next Best Action
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
          "This customer exhibits high purchase intent with low price sensitivity. They frequently browse {prefs.topCategory || "productivity electronics"} and respond strongly to stock availability rather than discount coupons. Projected to complete purchase within 24 hours if presented with complementary peripherals."
        </p>
        <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
          <span>Preferred Category: <strong className="text-slate-200">{prefs.topCategory || "Laptops"}</strong></span>
          <span>•</span>
          <span>Brand Affinity: <strong className="text-slate-200">{prefs.brandAffinity || "NovaTech"}</strong></span>
        </div>
      </div>

      {/* 2 Cols: Behavioral Timeline & Orders History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavioral Timeline */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Customer Journey & Behavioral Timeline</span>
          </h3>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-800">
            {customer.events && customer.events.length > 0 ? (
              customer.events.map((ev: any, idx: number) => {
                let dataObj: any = {};
                try {
                  dataObj = JSON.parse(ev.eventData || "{}");
                } catch (e) {}

                return (
                  <div key={ev.id} className="relative flex items-start gap-3 pl-6 text-xs">
                    <span className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900"></span>
                    <div className="flex-1 p-3 rounded-xl bg-slate-850/60 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-mono text-indigo-400 font-semibold">{ev.eventType}</span>
                        <span>{formatRelativeTime(ev.timestamp)}</span>
                      </div>
                      <p className="text-slate-200 mt-1 font-medium">
                        {dataObj.productName || dataObj.query || dataObj.details || "Observed customer touchpoint"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pl-6 text-xs text-slate-500 py-4">
                No recent live events recorded for this customer.
              </div>
            )}
          </div>
        </div>

        {/* Orders & AI Decisions */}
        <div className="space-y-6">
          {/* Orders */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span>Purchase History ({customer.orders?.length || 0})</span>
            </h3>

            <div className="space-y-2">
              {customer.orders && customer.orders.length > 0 ? (
                customer.orders.map((o: any) => (
                  <div
                    key={o.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">Order #{o.orderNumber}</span>
                      <div className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()} • {o.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatINR(o.total)}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {o.isAiInfluenced ? "AI-Attributed" : "Direct"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4">No completed orders yet.</p>
              )}
            </div>
          </div>

          {/* AI Decisions on Customer */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Agent Actions on this Customer</span>
            </h3>

            <div className="space-y-2">
              {customer.decisions && customer.decisions.length > 0 ? (
                customer.decisions.map((d: any) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-slate-200">{d.decision}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{d.reasoning}</div>
                    </div>
                    <button
                      onClick={() => setSelectedDecision(d)}
                      className="shrink-0 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-medium border border-slate-700"
                    >
                      Trace
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4">No AI decisions logged for this profile.</p>
              )}
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
