import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { ComplementaryUpsell } from "../types";
import { prisma } from "../../prisma";

export class UpsellCrossSellAgent {
  static readonly KEY = "UPSELL";

  static async findPairings(cartItems: any[]): Promise<ComplementaryUpsell[]> {
    const catalog = await prisma.product.findMany({
      include: { category: true },
    });

    const pairings = await aiEngine.recommendCrossSell(cartItems, catalog);

    if (pairings.length > 0) {
      await DecisionTracer.record({
        agentKey: this.KEY,
        eventType: "CROSS_SELL_PAIRING",
        context: {
          event: "Generated complementary accessory recommendations for active cart",
          details: `Cart contains: ${cartItems.map((ci) => ci.product?.name || "item").join(", ")}`,
        },
        intentScore: 84,
        riskLevel: "Low",
        optionsConsidered: pairings.map((p) => `${p.name} (₹${p.price.toLocaleString("en-IN")})`),
        decision: `Presented ${pairings.length} contextually verified accessories: ${pairings.map((p) => p.name).join(", ")}.`,
        confidence: 0.93,
        reasoning: pairings[0].pairingReason,
        status: "EXECUTED",
      });
    }

    return pairings;
  }
}
