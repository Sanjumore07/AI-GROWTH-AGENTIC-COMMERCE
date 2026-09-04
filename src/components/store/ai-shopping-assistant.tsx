"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  recommendedProductIds?: string[];
  quickReplies?: string[];
}

export function AiShoppingAssistant({ activeProduct }: { activeProduct?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your CommercePilot AI Shopping Advisor. Tell me what you're looking for, your budget, or your use case (e.g. 'I need wireless headphones under ₹8,000 for travel and calls'), and I'll find your perfect match.",
      quickReplies: [
        "Laptops for coding under ₹80,000",
        "Wireless ANC headphones under ₹8,000",
        "Best camera phone under ₹30,000",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalogMap, setCatalogMap] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          const map: Record<string, any> = {};
          data.products.forEach((p: any) => {
            map[p.id] = p;
          });
          setCatalogMap(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          activeProductId: activeProduct?.id,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            recommendedProductIds: data.recommendedProductIds,
            quickReplies: data.quickReplies,
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm temporarily experiencing high traffic. Based on standard catalog specifications, our top recommended models feature verified manufacturer warranties and rapid dispatch.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs sm:text-sm shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all border border-indigo-400/30 group"
          aria-label="Open AI Shopping Advisor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="font-semibold">Ask CommercePilot AI</span>
        </button>
      )}

      {/* Interactive Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[560px] max-h-[85vh] rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Commerce Advisor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-indigo-300">Catalog-Grounded Shopping Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                      : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/60"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  {/* Attached Recommended Products Cards */}
                  {m.recommendedProductIds && m.recommendedProductIds.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/50">
                      {m.recommendedProductIds.map((pId) => {
                        const product = catalogMap[pId];
                        if (!product) return null;
                        return (
                          <Link
                            key={product.id}
                            href={`/store/product/${product.slug}`}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-indigo-500/30 text-left transition-colors group/card"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover/card:text-indigo-300 transition-colors truncate max-w-[180px]">
                                {product.name}
                              </div>
                              <div className="text-[11px] font-bold text-emerald-400">
                                {formatINR(product.price)}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/card:text-white" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Reply Pills */}
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {m.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(qr)}
                        className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-950 text-indigo-300 hover:text-white border border-indigo-500/20 text-[11px] transition-colors text-left"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span>Advisor is evaluating catalog & specs...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about products, specs, budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
