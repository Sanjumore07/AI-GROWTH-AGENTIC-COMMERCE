import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { ShoppingIntent } from "../types";

export class ShoppingIntentAgent {
  static readonly KEY = "INTENT";

  static async process(query: string, customerId?: string): Promise<ShoppingIntent> {
    const intent = await aiEngine.analyzeIntent(query);

    // Record decision trace
    await DecisionTracer.record({
      agentKey: this.KEY,
      eventType: "SHOPPING_INTENT_ANALYSIS",
      customerId,
      context: {
        event: "Customer expressed natural language query",
        details: query,
      },
      intentScore: intent.intentScore,
      riskLevel: "Low",
      optionsConsidered: [
        `Classify as ${intent.category}`,
        "Request clarification on budget",
        "Broad semantic catalog scan",
      ],
      decision: `Categorized as '${intent.category}' (Score: ${intent.intentScore}/100, Urgency: ${intent.urgency})`,
      confidence: 0.94,
      reasoning: `Extracted explicit budget: ${intent.budget ? `₹${intent.budget.toLocaleString("en-IN")}` : "Uncapped"} and prioritized capabilities: ${intent.priorities.join(", ")}.`,
      status: "EXECUTED",
    });

    return intent;
  }
}
