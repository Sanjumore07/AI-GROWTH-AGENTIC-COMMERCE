"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  AlertTriangle,
  Send,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { formatINR, formatRelativeTime } from "@/lib/utils";
import { DecisionTraceModal, DecisionTraceData } from "@/components/decision-trace-modal";

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingCartId, setExecutingCartId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<DecisionTraceData | null>(null);

  const loadCarts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/decisions?agentKey=RECOVERY");
      const decData = await res.json();
      // Also fetch carts directly or via decision records
      const cartsRes = await fetch("/api/search?q=a"); // or we can query database
      // Let's fetch all carts from an endpoint or construct from API
    } catch (e) {}

    // Let's fetch from a dedicated route or query
    try {
      const res = await fetch("/api/approvals"); // fallback
    } catch (e) {}

    // Better yet, let's create a dedicated GET in /api/recovery or fetch carts
    fetch("/api/recovery/list")
      .then((r) => r.json())
      .then((data) => {
        if (data.carts) setCarts(data.carts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleSimulateRecovery = async (cartId: string, customerName: string) => {
    setExecutingCartId(cartId);
    setSuccessBanner(null);
    try {
      const res = await fetch("/api/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, action: "EXECUTE" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessBanner(
          `🎉 WOW MOMENT: ${customerName} returned via AI personalized reminder and completed purchase! Recovered ${formatINR(
            data.result.recoveredAmount
          )} (Order #${data.result.orderId.slice(-6)}). Dashboard metrics updated live!`
        );
        loadCarts();
      }
    } catch (err) {
      console.error("Recovery simulation failed:", err);
    } finally {
      setExecutingCartId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Abandonment Interceptor</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Abandoned Cart Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time intent scoring and margin-guarding recovery interventions across high-risk drop-offs.
          </p>
        </div>

        <button
          onClick={loadCarts}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Carts</span>
        </button>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-medium flex items-start gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-white">Cart Recovery Executed Successfully</div>
            <p className="text-emerald-200/90 mt-0.5 leading-relaxed">{successBanner}</p>
          </div>
        </div>
      )}

      {/* Hero Scenario Highlight Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Hero Demo Scenario: Rahul Sharma
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">
                Target Cart: Zenith Pro 16 Ultrabook (₹74,999) • Intent: 92/100
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Cart Recovery Agent evaluated 4 prior views and decided on a stock-urgency reminder with zero discount to preserve full merchant margin.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const rahulCart = carts.find((c) => c.customer?.name?.includes("Rahul"));
              if (rahulCart) {
                handleSimulateRecovery(rahulCart.id, rahulCart.customer.name);
              } else if (carts[0]) {
                handleSimulateRecovery(carts[0].id, carts[0].customer?.name || "Shopper");
              }
            }}
            disabled={executingCartId !== null}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {executingCartId ? "Simulating Return & Purchase..." : "Simulate Recovery (Hero Flow)"}
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Cart Value</th>
                <th className="pb-3 font-semibold">Last Activity</th>
                <th className="pb-3 font-semibold">Intent Score</th>
                <th className="pb-3 font-semibold">Abandonment Risk</th>
                <th className="pb-3 font-semibold">AI Recommended Action</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {carts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading abandoned cart telemetry...
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200">
                        {cart.customer?.name || "Anonymous Shopper"}
                      </div>
                      <div className="text-[11px] text-slate-500">{cart.customer?.email}</div>
                    </td>

                    <td className="py-3.5 font-semibold text-white">
                      {formatINR(cart.total)}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {formatRelativeTime(cart.abandonedAt || cart.lastActivityAt)}
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-emerald-400">
                        {cart.intentScore || 85}/100
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cart.abandonmentRisk === "High"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {cart.abandonmentRisk || "Medium"}
                      </span>
                    </td>

                    <td className="py-3.5 max-w-xs">
                      <span className="text-slate-300 font-medium line-clamp-1">
                        {cart.recoveryAction || "Personalized Stock Nudge"}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cart.status === "RECOVERED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {cart.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      {cart.status === "RECOVERED" ? (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Recovered</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSimulateRecovery(cart.id, cart.customer?.name || "Shopper")}
                          disabled={executingCartId === cart.id}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm disabled:opacity-50"
                        >
                          {executingCartId === cart.id ? "Sending..." : "Simulate Recovery"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DecisionTraceModal
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
