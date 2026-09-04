"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function ProductsManagerPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesQ =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === "ALL" || p.category?.name === selectedCat;
    return matchesQ && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Catalog Optimizer</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Product Catalog ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Hardware inventory, real-time stock levels, and AI semantic vector tags.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {["ALL", "Laptops", "Headphones", "Phones", "Accessories", "Smart Home", "Fitness"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
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
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">AI Match Score</th>
                <th className="pb-3 font-semibold text-right">Store View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading product catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.brand}</div>
                    </td>

                    <td className="py-3.5 text-slate-300">
                      {p.category?.name || "General"}
                    </td>

                    <td className="py-3.5 font-semibold text-white">
                      {formatINR(p.price)}
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-amber-400">
                        {p.rating}★
                      </span>{" "}
                      <span className="text-[10px] text-slate-500">({p.reviewCount})</span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.stockCount > 10
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : p.stockCount > 0
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {p.stockCount > 0 ? `${p.stockCount} in stock` : "Out of stock"}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-indigo-400">
                        {p.matchScore || 90}%
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <Link
                        href={`/store/product/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
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
