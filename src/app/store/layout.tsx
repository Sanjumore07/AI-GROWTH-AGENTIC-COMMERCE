"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { AiShoppingAssistant } from "@/components/store/ai-shopping-assistant";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cart?sessionId=default_session")
      .then((r) => r.json())
      .then((data) => {
        if (data.cart?.items) {
          const totalQty = data.cart.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
          setCartCount(totalQty);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 py-1.5 px-4 text-center text-xs font-medium text-indigo-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Powered by CommercePilot AI • Natural Language Intent Discovery Active</span>
        <span className="text-zinc-600 hidden sm:inline">•</span>
        <span className="text-emerald-400 font-semibold hidden sm:inline">Zero Friction Checkout (Razorpay Simulation)</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/store" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">CommercePilot</span>
              <span className="text-[10px] block font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                Shopper Store
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search trigger in header */}
        <button
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="hidden md:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 text-xs w-72 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="truncate">Search catalog, brands, specs...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <DemoBadge />

          <Link
            href="/store/cart"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            <span>Smart Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center -ml-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">CommercePilot AI</span>
            <span>—</span>
            <span>Razorpay AI Buildathon (Track 1: AI Growth & Agentic Commerce)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Merchant Control Plane
            </Link>
            <span>•</span>
            <Link href="/dashboard/simulation" className="hover:text-white transition-colors">
              Hero Demo Simulation
            </Link>
            <span>•</span>
            <span>Razorpay Simulation Sandbox</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Shopping Assistant */}
      <AiShoppingAssistant />
    </div>
  );
}
