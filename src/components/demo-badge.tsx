"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Store, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export function DemoBadge() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-medium text-indigo-300">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>Razorpay Buildathon Demo</span>
      <span className="text-zinc-500">|</span>
      {isDashboard ? (
        <Link
          href="/store"
          className="flex items-center gap-1 text-indigo-200 hover:text-white transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Switch to Shopper View</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-indigo-200 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Switch to Merchant Control</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
