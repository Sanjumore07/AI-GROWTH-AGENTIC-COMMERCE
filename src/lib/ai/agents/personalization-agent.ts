import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { CustomerBehaviorProfile } from "../types";
import { prisma } from "../../prisma";

export class PersonalizationAgent {
  static readonly KEY = "PERSONALIZATION";

  static async profile(customerId: string): Promise<CustomerBehaviorProfile | null> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: true,
        events: { take: 20, orderBy: { timestamp: "desc" } },
      },
    });

    if (!customer) return null;

    const profile = await aiEngine.analyzeCustomerProfile(customer, customer.orders, customer.events);

    await DecisionTracer.record({
      agentKey: this.KEY,
      eventType: "CUSTOMER_360_PROFILING",
      customerId,
      context: {
        event: "Customer profile synthesized",
        details: `Orders: ${customer.ordersCount}, Spend: ₹${customer.totalSpend.toLocaleString("en-IN")}`,
      },
      intentScore: Math.round(profile.purchaseProbability * 100),
      riskLevel: profile.churnRisk,
      optionsConsidered: ["Segment as Price Sensitive", "Segment as High Intent", "Flag as At-Risk"],
      decision: `Classified as ${profile.segment} with ${profile.priceSensitivity} price sensitivity.`,
      confidence: 0.91,
      reasoning: profile.summary,
      status: "EXECUTED",
    });

    return profile;
  }
}
