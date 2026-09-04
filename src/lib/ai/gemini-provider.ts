import { AIProvider } from "./provider";
import { HeuristicAIProvider } from "./heuristic-provider";
import {
  ShoppingIntent,
  RankedProductRecommendation,
  OfferDecision,
  CartRecoveryDecision,
  ComplementaryUpsell,
  CustomerBehaviorProfile,
  CampaignGenerationResult,
  GrowthInsightItem,
  AdvisorChatMessage,
} from "./types";

export class GeminiAIProvider implements AIProvider {
  name = "Google Gemini AI (with Autonomous Resilient Fallback)";
  private fallback: HeuristicAIProvider;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new HeuristicAIProvider();
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string | null> {
    if (!this.apiKey) return null;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const payload: any = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[Gemini API] Request failed with status ${res.status}. Falling back to heuristic engine.`);
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err) {
      console.warn("[Gemini API] Connection error, delegating to heuristic engine:", err);
      return null;
    }
  }

  async analyzeIntent(query: string, context?: Record<string, any>): Promise<ShoppingIntent> {
    const prompt = `Analyze this customer e-commerce query and return JSON:
Query: "${query}"
Format:
{
  "rawQuery": "${query}",
  "category": "detected product category",
  "budget": number or null,
  "useCase": "primary use case",
  "priorities": ["priority 1", "priority 2"],
  "constraints": ["constraint 1"],
  "intentScore": integer 0-100,
  "urgency": "Low" | "Medium" | "High"
}`;

    const text = await this.callGemini(prompt, "You are an expert commerce shopping intent agent. Respond in raw JSON only.");
    if (text) {
      try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.category && parsed.intentScore) {
          return parsed;
        }
      } catch (e) {
        // Fall back
      }
    }
    return this.fallback.analyzeIntent(query, context);
  }

  async rankProductsForIntent(
    intent: ShoppingIntent,
    catalog: any[],
    customerContext?: any
  ): Promise<RankedProductRecommendation[]> {
    // Rely on heuristic algorithm for fast deterministic ranking with catalog grounding
    return this.fallback.rankProductsForIntent(intent, catalog, customerContext);
  }

  async generateOffer(cart: any, customer: any, intent?: ShoppingIntent): Promise<OfferDecision> {
    return this.fallback.generateOffer(cart, customer, intent);
  }

  async evaluateCartRecovery(
    cart: any,
    customer: any,
    historyEvents: any[]
  ): Promise<CartRecoveryDecision> {
    return this.fallback.evaluateCartRecovery(cart, customer, historyEvents);
  }

  async recommendCrossSell(cartItems: any[], catalog: any[]): Promise<ComplementaryUpsell[]> {
    return this.fallback.recommendCrossSell(cartItems, catalog);
  }

  async analyzeCustomerProfile(
    customer: any,
    orders: any[],
    events: any[]
  ): Promise<CustomerBehaviorProfile> {
    return this.fallback.analyzeCustomerProfile(customer, orders, events);
  }

  async generateCampaign(
    goal: string,
    audience: string,
    catalog: any[]
  ): Promise<CampaignGenerationResult> {
    const prompt = `Generate a targeted commerce campaign for goal: "${goal}", audience: "${audience}". Catalog has products: ${catalog.slice(0, 5).map((p) => p.name).join(", ")}. Return JSON with fields: name, goal, targetAudience, message, expectedImpact, aiReasoning.`;
    const text = await this.callGemini(prompt, "You are a growth marketing AI agent. Return valid JSON only.");
    if (text) {
      try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.name && parsed.message) {
          return {
            ...parsed,
            recommendedProductIds: catalog.slice(0, 3).map((p) => p.id),
          };
        }
      } catch (e) {}
    }
    return this.fallback.generateCampaign(goal, audience, catalog);
  }

  async generateGrowthInsights(metrics: any): Promise<GrowthInsightItem[]> {
    return this.fallback.generateGrowthInsights(metrics);
  }

  async advisorChat(
    history: AdvisorChatMessage[],
    currentQuery: string,
    catalog: any[],
    activeProduct?: any
  ): Promise<{
    reply: string;
    recommendedProductIds: string[];
    quickReplies: string[];
  }> {
    return this.fallback.advisorChat(history, currentQuery, catalog, activeProduct);
  }
}
