"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  X,
  User,
  Package,
  ShoppingBag,
  Bot,
  AlertTriangle,
  Play,
} from "lucide-react";

interface SearchItem {
  type: string;
  title: string;
  subtitle: string;
  link: string;
}

export function GlobalCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Command palette search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (link: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, search products, customers, orders, or agents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick links when empty */}
        {query.length < 2 && (
          <div className="p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSelect("/dashboard/simulation")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-500/20 text-left transition-colors"
              >
                <Play className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-semibold">Hero Simulation</div>
                  <div className="text-[10px] text-indigo-300/70">Execute Rahul Sharma recovery</div>
                </div>
              </button>

              <button
                onClick={() => handleSelect("/dashboard/ai-commerce")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50 text-left transition-colors"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-semibold">AI Command Center</div>
                  <div className="text-[10px] text-slate-400">10 Autonomous Agents</div>
                </div>
              </button>

              <button
                onClick={() => handleSelect("/dashboard/abandoned-carts")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50 text-left transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold">Abandoned Carts</div>
                  <div className="text-[10px] text-slate-400">15 high-intent drops</div>
                </div>
              </button>

              <button
                onClick={() => handleSelect("/store")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50 text-left transition-colors"
              >
                <Package className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">Shopper Storefront</div>
                  <div className="text-[10px] text-slate-400">Natural language search</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Searching catalog and records...</div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No matching records found for "{query}".</div>
            ) : (
              results.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(res.link)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-800 text-indigo-400 group-hover:bg-indigo-600/20">
                      {res.type === "Product" && <Package className="w-4 h-4" />}
                      {res.type === "Customer" && <User className="w-4 h-4" />}
                      {res.type === "Order" && <ShoppingBag className="w-4 h-4" />}
                      {res.type === "Agent" && <Bot className="w-4 h-4" />}
                      {res.type === "Abandoned Cart" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{res.title}</div>
                      <div className="text-xs text-slate-400">{res.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {res.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="font-mono bg-slate-800 px-1 rounded">↑</kbd> <kbd className="font-mono bg-slate-800 px-1 rounded">↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-slate-800 px-1 rounded">↵</kbd></span>
          </div>
          <span>Press <kbd className="font-mono bg-slate-800 px-1 rounded">⌘K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
}
