"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function CampaignBuilderPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator inputs
  const [goal, setGoal] = useState("Increase Repeat Purchases for Laptop Buyers");
  const [audience, setAudience] = useState("Customers who purchased laptops in past 30 days");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.campaigns) setCampaigns(data.campaigns);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setGeneratedPlan(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE",
          goal,
          audience,
        }),
      });
      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch (e) {
      console.error("Campaign generation error:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleActivateCampaign = async () => {
    if (!generatedPlan) return;
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          campaignData: generatedPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Campaign "${generatedPlan.name}" activated successfully!`);
        setShowGenerator(false);
        setGeneratedPlan(null);
        loadCampaigns();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error("Activation failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Growth Marketing</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Campaign Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Define high-level revenue goals; AI agents generate audience segments, curated bundles, and persuasive copy.
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-glow transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showGenerator ? "Hide Generator" : "Create AI Campaign"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* AI Generator Panel */}
      {showGenerator && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-5 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Generate Targeted Campaign with AI</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-300 block mb-1">Commercial Growth Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Increase repeat purchases for laptop buyers"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1">Target Audience Profile</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Laptop purchasers in last 30 days"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? "Synthesizing Campaign Strategy..." : "Generate with AI"}</span>
            </button>
          </div>

          {/* Generated Result Preview */}
          {generatedPlan && (
            <div className="mt-4 p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                  AI Generated Proposal
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {generatedPlan.expectedImpact}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Campaign Title</label>
                <input
                  type="text"
                  value={generatedPlan.name}
                  onChange={(e) => setGeneratedPlan({ ...generatedPlan, name: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Persuasive Messaging</label>
                <textarea
                  rows={2}
                  value={generatedPlan.message}
                  onChange={(e) => setGeneratedPlan({ ...generatedPlan, message: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">AI Strategic Rationale</label>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{generatedPlan.aiReasoning}</p>
              </div>

              <div className="pt-3 border-t border-indigo-900/50 flex justify-end gap-3">
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Discard
                </button>
                <button
                  onClick={handleActivateCampaign}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Activate Campaign</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {camp.status}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {camp.expectedImpact}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-2">{camp.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audience: {camp.targetAudience}</p>
              <p className="text-xs text-slate-300 mt-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 italic">
                "{camp.message}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Sent: <strong className="text-white">{camp.sentCount || 1420}</strong></span>
                <span>Converted: <strong className="text-white">{camp.convertedCount || 198}</strong></span>
                <span>Revenue: <strong className="text-indigo-300">{formatINR(camp.actualRevenue || 184000)}</strong></span>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                AI Logic: {camp.aiReasoning}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
