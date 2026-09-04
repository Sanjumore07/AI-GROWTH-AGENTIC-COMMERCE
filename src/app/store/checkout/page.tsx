"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Building2,
  Smartphone,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function SmartCheckoutPage() {
  const [step, setStep] = useState<"DETAILS" | "PAYMENT" | "CONFIRMED">("DETAILS");
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@example.in");
  const [phone, setPhone] = useState("+91 98201 44521");
  const [street, setStreet] = useState("Flat 402, Prestige Cyber Towers, Outer Ring Road");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560103");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("UPI (Razorpay Sim)");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cart?sessionId=default_session")
      .then((r) => r.json())
      .then((data) => {
        if (data.cart) setCart(data.cart);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handlePlaceOrder = async () => {
    if (!cart) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          customerDetails: { name, email, phone },
          shippingAddress: { street, city, state, postalCode },
          paymentMethod,
          paymentSimulationId: `pay_sim_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.order);
        setStep("CONFIRMED");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Preparing secure checkout session...
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Simulation Badge */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Razorpay Buildathon Demo Sandbox</span>
          <span className="text-slate-500">|</span>
          <span className="text-indigo-300">Clearly Labeled Simulation Mode</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-300 text-[10px] font-mono">
          NO REAL CARDS CHARGED
        </span>
      </div>

      {step === "CONFIRMED" ? (
        /* Order Confirmed Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Payment Verified (Razorpay Simulation)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Order Confirmed & Placed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Order #{completedOrder?.orderNumber || "ORD-2026"} has been dispatched to merchant fulfillment ledger.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Paid:</span>
              <span className="font-bold text-white text-sm">{formatINR(completedOrder?.total || total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Gateway:</span>
              <span className="text-indigo-300 font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Customer:</span>
              <span className="text-slate-200">{name} ({email})</span>
            </div>
          </div>

          {/* Post-Purchase Retention Hook */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 text-xs text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Retention Agent Active</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              "A personalized unboxing guide and complimentary warranty registration pass will arrive in your inbox 2 hours before delivery."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/store"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Return to Store
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Inspect in Merchant Dashboard →
            </Link>
          </div>
        </div>
      ) : (
        /* Multi-step Checkout Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === "DETAILS" && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  <span>1. Shipping & Contact Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-slate-400 block mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-400 block mb-1 font-medium">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setStep("PAYMENT")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === "PAYMENT" && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>2. Razorpay Payment Gateway (Simulation)</span>
                  </h2>
                  <button
                    onClick={() => setStep("DETAILS")}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Edit Address
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "UPI (Razorpay Sim)",
                      label: "Instant UPI (GPay / PhonePe / Paytm)",
                      desc: "Simulated instant VPA transfer with zero latency",
                      icon: Smartphone,
                    },
                    {
                      id: "Credit Card (Razorpay Sim)",
                      label: "Credit / Debit Card",
                      desc: "Visa, Mastercard, RuPay test authorization",
                      icon: CreditCard,
                    },
                    {
                      id: "NetBanking (Razorpay Sim)",
                      label: "Net Banking (All Indian Banks)",
                      desc: "HDFC, ICICI, SBI simulated instant transfer",
                      icon: Building2,
                    },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <label
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all ${
                          paymentMethod === m.id
                            ? "bg-indigo-950/60 border-indigo-500 text-white shadow-sm"
                            : "bg-slate-850/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)}
                          className="accent-indigo-500"
                        />
                        <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{m.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-bit SSL Razorpay Sandbox Protected</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <span>{submitting ? "Verifying Webhook..." : `Simulate Pay ${formatINR(total)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Order Summary */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-white">Cart Summary</h3>

            <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-slate-800 text-xs">
              {items.map((it: any) => (
                <div key={it.id} className="pt-2.5 first:pt-0 flex justify-between gap-2">
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 truncate">{it.product?.name}</div>
                    <div className="text-slate-500 text-[11px]">Qty: {it.quantity}</div>
                  </div>
                  <span className="font-semibold text-white whitespace-nowrap">
                    {formatINR(it.priceAtAdd * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Express Shipping:</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-base text-indigo-300">{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
