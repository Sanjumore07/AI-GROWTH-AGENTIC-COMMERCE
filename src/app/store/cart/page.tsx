"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function SmartCartPage() {
  const [cart, setCart] = useState<any>(null);
  const [upsells, setUpsells] = useState<any[]>([]);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedUpsell, setDismissedUpsell] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart?sessionId=default_session");
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
        setUpsells(data.upsells || []);
        setOffer(data.offer || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = async (productId: string, delta: number) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", productId, quantity: delta }),
      });
      loadCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REMOVE", cartItemId }),
      });
      loadCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUpsell = async (productId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", productId, quantity: 1 }),
      });
      loadCart();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading smart cart...
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = offer?.discountAmount || cart?.discount || 0;
  const shipping = offer?.type === "FREE_SHIPPING" ? 0 : subtotal > 50000 ? 0 : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Smart Cart</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {items.length} unique items • Monitored continuously by Offer & Companion Agents
          </p>
        </div>

        <Link
          href="/store"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Your Cart is Currently Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the natural language AI intent bar on the storefront to quickly find verified products within your exact budget.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {items.map((item: any) => {
                let img = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80";
                try {
                  const arr = JSON.parse(item.product?.images || "[]");
                  if (arr.length > 0) img = arr[0];
                } catch (e) {}

                return (
                  <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <img src={img} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/store/product/${item.product?.slug}`}
                          className="font-semibold text-white text-sm hover:text-indigo-300 transition-colors line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <div className="text-xs text-slate-400 mt-0.5">{item.product?.brand}</div>
                        <div className="text-sm font-bold text-white mt-1">
                          {formatINR(item.priceAtAdd)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700">
                        <button
                          onClick={() => handleUpdateQty(item.productId, -1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.productId, 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Proactive Companion Upsell Panel */}
            {upsells.length > 0 && !dismissedUpsell && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      Your AI Shopping Assistant Noticed...
                    </span>
                  </div>
                  <button
                    onClick={() => setDismissedUpsell(true)}
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    Dismiss
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  "You're purchasing hardware equipment. Verified buyers frequently pair these complementary peripherals to ensure full connectivity and drop protection on day one:"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {upsells.slice(0, 2).map((up) => (
                    <div
                      key={up.productId}
                      className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs truncate">{up.name}</div>
                        <div className="text-[11px] font-bold text-emerald-400">{formatINR(up.price)}</div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{up.pairingReason}</p>
                      </div>
                      <button
                        onClick={() => handleAddUpsell(up.productId)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Summary & Offer Agent */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white">Order Summary</h2>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cart Subtotal:</span>
                  <span className="font-semibold text-white">{formatINR(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>AI Applied Discount:</span>
                    <span>- {formatINR(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Shipping:</span>
                  <span className="font-semibold text-white">
                    {shipping === 0 ? "FREE" : formatINR(shipping)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-sm">
                  <span className="font-bold text-white">Grand Total:</span>
                  <span className="font-extrabold text-white text-lg">{formatINR(total)}</span>
                </div>
              </div>

              {/* Offer Agent Reasoning Insight */}
              {offer && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                    <Tag className="w-3 h-3" />
                    <span>Offer Optimization Agent</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{offer.reasoning}</p>
                </div>
              )}

              <Link
                href="/store/checkout"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm text-center shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Smart Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-slate-500">
                Simulated Razorpay Sandbox • Instant payment state verification
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
