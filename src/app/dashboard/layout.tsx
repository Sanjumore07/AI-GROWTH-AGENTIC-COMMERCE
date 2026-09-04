"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  ShieldAlert,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Megaphone,
  BarChart3,
  Lightbulb,
  PlayCircle,
  Activity,
  Settings,
  Search,
  Store,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { NotificationCenter } from "@/components/notification-center";
import { DemoBadge } from "@/components/demo-badge";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Commerce", href: "/dashboard/ai-commerce", icon: Bot, badge: "Live" },
  { name: "Approvals", href: "/dashboard/approvals", icon: ShieldAlert, badgeKey: "approvals" },
  { name: "Abandoned Carts", href: "/dashboard/abandoned-carts", icon: ShoppingCart, badge: "15" },
  { name: "Hero Simulation", href: "/dashboard/simulation", icon: PlayCircle, highlight: true },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: FileText },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "AI Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Activity Log", href: "/dashboard/activity", icon: Activity },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(1);

  useEffect(() => {
    fetch("/api/approvals")
      .then((r) => r.json())
      .then((data) => {
        if (data.approvals) {
          setPendingApprovalsCount(data.approvals.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">CommercePilot</span>
              <span className="text-[10px] block font-mono text-indigo-400 font-semibold tracking-wider uppercase">
                AI Agentic Engine
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : item.highlight
                    ? "bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.highlight ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badgeKey === "approvals" && pendingApprovalsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingApprovalsCount}
                  </span>
                )}

                {item.badge && !item.badgeKey && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                      item.badge === "Live"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.highlight && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Storefront Link Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <Link
            href="/store"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors border border-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="text-xs font-semibold">Shopper Storefront</div>
                <div className="text-[10px] text-slate-400">Experience AI as a customer</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="h-16 sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Cmd+K Button */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-400 text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search customers, products, decisions...</span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-900 rounded border border-slate-700 text-slate-300">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <DemoBadge />
            <NotificationCenter />

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                TN
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-white">TechNest India</div>
                <div className="text-[10px] text-slate-400">Enterprise Pilot</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
