import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { ShoppingIntent, RankedProductRecommendation } from "../types";
import { prisma } from "../../prisma";

export class ProductDiscoveryAgent {
  static readonly KEY = "DISCOVERY";

  static async discover(
    intent: ShoppingIntent,
    customerId?: string
  ): Promise<RankedProductRecommendation[]> {
    const products = await prisma.product.findMany({
      include: { category: true },
    });

    const ranked = await aiEngine.rankProductsForIntent(intent, products);

    if (ranked.length > 0) {
      await DecisionTracer.record({
        agentKey: this.KEY,
        eventType: "CATALOG_RANKING",
        customerId,
        context: {
          event: "Ranked catalog based on customer intent",
          details: `Targeting category '${intent.category}' within ₹${intent.budget ? intent.budget.toLocaleString("en-IN") : "unlimited"} budget.`,
        },
        intentScore: intent.intentScore,
        riskLevel: "Low",
        optionsConsidered: ranked.map((r) => `${r.badge}: ${r.name} (₹${r.price.toLocaleString("en-IN")})`),
        decision: `Recommended ${ranked.length} shortlisted items with ${ranked[0].name} designated as BEST_MATCH (${ranked[0].matchScore}% match).`,
        confidence: 0.92,
        reasoning: ranked[0].reasons.join(". "),
        status: "EXECUTED",
      });
    }

    return ranked;
  }
}
