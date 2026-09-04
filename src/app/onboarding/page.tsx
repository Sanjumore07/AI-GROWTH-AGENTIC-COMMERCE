"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Bot,
  Sliders,
  Store,
  Layers,
} from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleInstantSetup = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative">
      <div className="relative w-full max-w-2xl p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Merchant Onboarding</h1>
              <p className="text-xs text-slate-400">Setup your Autonomous Commerce Workspace</p>
            </div>
          </div>

          <button
            onClick={handleInstantSetup}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            ⚡ Use Demo Store (1-Click)
          </button>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          {[
            { num: 1, label: "Business Info" },
            { num: 2, label: "Catalog" },
            { num: 3, label: "AI Swarm" },
            { num: 4, label: "Autonomy" },
            { num: 5, label: "Launch" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                  currentStep >= s.num
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {s.num}
              </span>
              <span className={`hidden sm:inline ${currentStep >= s.num ? "text-white font-medium" : ""}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-700/50 space-y-4">
          {currentStep === 1 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-semibold text-white">Step 1: Business Information</h3>
              <p className="text-slate-400">Tell us about your brand name and customer currency.</p>
              <div>
                <label className="text-slate-400 block mb-1">Store Name</label>
                <input
                  type="text"
                  defaultValue="TechNest Store"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-semibold text-white">Step 2: Connect Hardware Catalog</h3>
              <p className="text-slate-400">Catalog connected with 111 pre-seeded items across Laptops, Phones, Audio, and Peripherals.</p>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-medium">
                ✓ 111 verified products indexed into semantic intent vector database.
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-semibold text-white">Step 3: Configure AI Swarm</h3>
              <p className="text-slate-400">All 10 specialized agents initialized with resilient heuristic fallback.</p>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 font-medium">
                ✓ Intent, Discovery, Recovery, Offer, Upsell, Advisor & Growth agents ready.
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-semibold text-white">Step 4: Set Autonomy Policies</h3>
              <p className="text-slate-400">High-value cart discounts (&gt;₹8,000) default to Approval Required.</p>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-medium">
                ✓ Human-in-the-loop protection configured for margin defense.
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3 text-xs text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Ready to Go Live!</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Your autonomous commerce operating workspace is fully operational.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
          ) : <span />}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow transition-all"
            >
              Open Commerce Dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
