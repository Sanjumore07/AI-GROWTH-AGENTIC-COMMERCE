"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  ShoppingBag,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { RankedProductRecommendation } from "@/lib/ai/types";

const exampleQueries = [
  "I need a laptop under ₹80,000 for coding and college",
  "Wireless headphones under ₹8,000 with ANC for travel and calls",
  "Best camera phone under ₹30,000 with fast charging",
  "Ergonomic developer accessories for dual monitor desk",
];

const categoryPills = [
  "ALL",
  "Laptops",
  "Headphones",
  "Phones",
  "Accessories",
  "Smart Home",
  "Fitness",
  "Audio",
  "Tablets",
];

export default function StorefrontHomePage() {
  const [query, setQuery] = useState("");
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [reasoningStep, setReasoningStep] = useState<string>("");
  const [aiRecommendations, setAiRecommendations] = useState<RankedProductRecommendation[]>([]);
  const [detectedIntent, setDetectedIntent] = useState<any>(null);

  // Standard catalog
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [cartAddingId, setCartAddingId] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setAllProducts(data.products);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingCatalog(false));
  }, []);

  const handleAiIntentSearch = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || isSearchingAI) return;

    setIsSearchingAI(true);
    setAiRecommendations([]);
    setDetectedIntent(null);

    // Dynamic reasoning animations
    setReasoningStep("Shopping Intent Agent analyzing natural language query & constraints...");
    setTimeout(() => {
      setReasoningStep("Product Discovery Agent evaluating catalog specifications & budget caps...");
    }, 450);
    setTimeout(() => {
      setReasoningStep("Personalization & Ranking Agent selecting Best Match, Value, Budget & Premium picks...");
    }, 900);

    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.success) {
        setDetectedIntent(data.intent);
        setAiRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error("AI intent search error:", err);
    } finally {
      setIsSearchingAI(false);
      setReasoningStep("");
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    setCartAddingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setAddedNotice(`Added "${productName}" to Smart Cart!`);
        setTimeout(() => setAddedNotice(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCartAddingId(null);
    }
  };

  const filteredCatalog = allProducts.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return (p.category?.name || p.category) === selectedCategory;
  });

  return (
    <div className="space-y-10">
      {/* Hero Intent Discovery Section */}
      <section className="relative rounded-3xl p-6 sm:p-12 overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Product Discovery Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Tell us what you're looking for.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Speak your natural intent — budget, use cases, hardware priorities. Our AI agents understand context and shortlist verified matches.
          </p>

          {/* Large AI Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAiIntentSearch();
            }}
            className="mt-6 relative flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. I need a laptop under ₹80,000 for coding and college..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900/95 border border-indigo-500/40 rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xl transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSearchingAI || !query.trim()}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm sm:text-base shadow-glow transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSearchingAI ? "Analyzing..." : "Find Matches"}</span>
            </button>
          </form>

          {/* Example Intent Prompts */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Try asking:</span>
            {exampleQueries.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ex);
                  handleAiIntentSearch(ex);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Added to Cart Toast Notification */}
      {addedNotice && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-indigo-950 border border-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{addedNotice}</span>
          <Link
            href="/store/cart"
            className="ml-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Open Cart →
          </Link>
        </div>
      )}

      {/* AI Reasoning Loading State */}
      {isSearchingAI && (
        <div className="p-8 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-3 animate-in fade-in">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Autonomous Commerce Swarm at Work
          </h3>
          <p className="text-xs text-indigo-300 font-mono animate-pulse">
            {reasoningStep}
          </p>
        </div>
      )}

      {/* AI Recommendations Section */}
      {aiRecommendations.length > 0 && !isSearchingAI && (
        <section className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">AI Matched Recommendations</h2>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                  {aiRecommendations.length} Curated Options
                </span>
              </div>
              {detectedIntent && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted Category: <strong className="text-slate-200">{detectedIntent.category}</strong> • Budget: <strong className="text-emerald-400">{detectedIntent.budget ? formatINR(detectedIntent.budget) : "Uncapped"}</strong> • Use Case: <strong className="text-slate-200">{detectedIntent.useCase}</strong>
                </p>
              )}
            </div>

            <button
              onClick={() => setAiRecommendations([])}
              className="text-xs text-slate-400 hover:text-white self-start sm:self-auto"
            >
              Clear AI Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {aiRecommendations.map((rec) => {
              const badgeColors: Record<string, string> = {
                BEST_MATCH: "bg-indigo-600 text-white border-indigo-400",
                BEST_VALUE: "bg-emerald-600/90 text-white border-emerald-400",
                BUDGET_PICK: "bg-amber-600/90 text-white border-amber-400",
                PREMIUM_CHOICE: "bg-purple-600/90 text-white border-purple-400",
              };

              return (
                <div
                  key={rec.productId}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Badge & Match Score */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${badgeColors[rec.badge] || badgeColors.BEST_MATCH}`}>
                        {rec.badge.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {rec.matchScore}% Match
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Pricing */}
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {rec.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-white">{formatINR(rec.price)}</span>
                        {rec.originalPrice > rec.price && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatINR(rec.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Why this matches bullets */}
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                        Why AI Recommends This:
                      </span>
                      {rec.reasons.slice(0, 3).map((r, rIdx) => (
                        <div key={rIdx} className="text-slate-300 text-[11px] leading-snug flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/store/product/${rec.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-0`}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors"
                    >
                      Inspect Specs
                    </Link>

                    <button
                      onClick={() => handleAddToCart(rec.productId, rec.name)}
                      disabled={cartAddingId === rec.productId}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 shrink-0"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Catalog Browsing Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Explore Full Hardware Catalog</h2>
            <p className="text-xs text-slate-400">Verified inventory ready for priority next-day dispatch</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {categoryPills.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loadingCatalog ? (
            <div className="col-span-4 py-16 text-center text-xs text-slate-400">
              Loading catalog products...
            </div>
          ) : filteredCatalog.length === 0 ? (
            <div className="col-span-4 py-16 text-center text-xs text-slate-400">
              No products found in category "{selectedCategory}".
            </div>
          ) : (
            filteredCatalog.slice(0, 16).map((product) => {
              let parsedImg = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80";
              try {
                const arr = JSON.parse(product.images || "[]");
                if (arr.length > 0) parsedImg = arr[0];
              } catch (e) {}

              return (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all group"
                >
                  <div className="space-y-2.5">
                    {/* Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                      <img
                        src={parsedImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-sm text-slate-300">
                        {product.category?.name || "Hardware"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                        <span className="text-amber-400 font-semibold flex items-center">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                          {product.rating}
                        </span>
                        <span>•</span>
                        <span>{product.brand}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-white">{formatINR(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/store/product/${product.slug}`}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors"
                    >
                      Details & AI Q&A
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={cartAddingId === product.id}
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
