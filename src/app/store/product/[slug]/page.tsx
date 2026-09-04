"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Bot,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [askingAi, setAskingAi] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAskAI = async (question: string) => {
    if (!product) return;
    setAskingAi(true);
    setActiveQuestion(question);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          activeProductId: product.id,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiAnswer(data.reply);
      }
    } catch (e) {
      setAiAnswer("This device offers verified hardware benchmarks and official manufacturer warranty coverage.");
    } finally {
      setAskingAi(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", productId: product.id, quantity: 1 }),
      });
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Product Not Found</h2>
        <Link href="/store" className="text-xs text-indigo-400 hover:underline">
          ← Return to Storefront
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images || "[]");
  } catch (e) {}
  const mainImage = images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80";

  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(product.attributes || "{}");
  } catch (e) {}

  let features: string[] = [];
  try {
    features = JSON.parse(product.features || "[]");
  } catch (e) {}

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/store"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store Catalog</span>
      </Link>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <Truck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <span className="font-semibold block text-white">Free Express</span>
              <span className="text-[10px] text-slate-500">24h Dispatch</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <RotateCcw className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="font-semibold block text-white">7-Day Return</span>
              <span className="text-[10px] text-slate-500">Hassle-Free</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <span className="font-semibold block text-white">1-Year Warranty</span>
              <span className="text-[10px] text-slate-500">Official Brand</span>
            </div>
          </div>
        </div>

        {/* Right: Info & AI Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {product.category?.name || "Hardware"}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{product.brand}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-500">({product.reviewCount} verified ratings)</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">
                {product.stockCount > 0 ? `In Stock (${product.stockCount} units)` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Merchant Retail Price</span>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Smart Cart</span>
            </button>
          </div>

          {addedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Item added to your Smart Cart!</span>
              </span>
              <Link href="/store/cart" className="underline hover:text-white">
                View Cart →
              </Link>
            </div>
          )}

          {/* Section: Why CommercePilot Recommends This */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why CommercePilot Recommends This</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Recommended because it delivers balanced thermal dissipation, high verified customer satisfaction ({product.rating}★), and fits within standard productivity and engineering budgets with zero inventory backorder delays.
            </p>
          </div>

          {/* Section: Ask AI About This Product */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask AI About This Product</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                "Is this good for students?",
                "How does it compare with alternatives?",
                "Is this worth the price?",
                "What accessories do I need?",
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAskAI(q)}
                  disabled={askingAi}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    activeQuestion === q
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* AI Answer Box */}
            {askingAi && (
              <div className="p-3.5 rounded-xl bg-slate-850 text-xs text-slate-400 font-mono animate-pulse">
                Advisor is formulating grounded response from product specifications...
              </div>
            )}

            {aiAnswer && !askingAi && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed animate-in fade-in">
                <span className="font-semibold text-indigo-300 block mb-1">
                  AI Commerce Advisor:
                </span>
                {aiAnswer}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px] text-slate-400">
              Product Overview
            </h3>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications Table */}
          {Object.keys(specs).length > 0 && (
            <div className="space-y-2 text-xs">
              <h3 className="font-semibold text-white uppercase tracking-wider text-[11px] text-slate-400">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400 capitalize text-[11px] block">{key}</span>
                    <span className="font-semibold text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
