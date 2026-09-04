import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { OfferDecision, ShoppingIntent } from "../types";
import { prisma } from "../../prisma";

export class OfferOptimizationAgent {
  static readonly KEY = "OFFER";

  static async evaluate(cartId: string, intent?: ShoppingIntent): Promise<OfferDecision> {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { customer: true, items: { include: { product: true } } },
    });

    const agentRecord = await prisma.aIAgent.findUnique({
      where: { key: this.KEY },
    });

    const offer = await aiEngine.generateOffer(cart, cart?.customer, intent);

    // Check autonomy level
    const autonomy = agentRecord?.autonomyLevel || "AUTO_EXECUTE";
    const requiresApproval =
      autonomy === "APPROVAL_REQUIRED" ||
      offer.requiresApproval ||
      (offer.type === "PERCENT_DISCOUNT" && (offer.value || 0) >= 15);

    const status = requiresApproval ? "PENDING_APPROVAL" : "EXECUTED";

    await DecisionTracer.record({
      agentKey: this.KEY,
      eventType: "CHECKOUT_OFFER_OPTIMIZATION",
      customerId: cart?.customerId ?? undefined,
      entityType: "Cart",
      entityId: cartId,
      context: {
        event: "Evaluated cart incentive eligibility",
        details: `Cart Total: ₹${(cart?.total || 0).toLocaleString("en-IN")}, Items: ${cart?.items?.length || 0}`,
        cartValue: cart?.total || 0,
      },
      intentScore: intent?.intentScore ?? cart?.intentScore ?? 80,
      riskLevel: "Low",
      optionsConsidered: [
        "No Offer (Preserve Full Margin)",
        "Free Shipping (Absorption ₹250)",
        "10-15% Promotional Discount",
      ],
      decision: offer.type === "NO_OFFER"
        ? "No discount required; customer intent is sufficiently strong."
        : `Offer ${offer.type} (${offer.promoCode || "auto-applied"})`,
      confidence: offer.confidence,
      reasoning: offer.reasoning,
      requiresApproval,
      status,
    });

    if (requiresApproval) {
      await prisma.notification.create({
        data: {
          title: "Human Approval Required: High-Value Offer",
          message: `Offer Agent proposed ${offer.type} for Cart #${cartId.slice(-6)} (Value: ₹${(cart?.total || 0).toLocaleString("en-IN")}). Requires merchant confirmation.`,
          type: "APPROVAL_REQUIRED",
          link: "/dashboard/approvals",
        },
      });
    }

    return {
      ...offer,
      requiresApproval,
    };
  }
}
