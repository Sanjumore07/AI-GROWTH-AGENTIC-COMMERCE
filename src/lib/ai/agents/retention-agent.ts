import { DecisionTracer } from "../decision-tracer";
import { prisma } from "../../prisma";

export class CustomerRetentionAgent {
  static readonly KEY = "RETENTION";

  static async onPurchaseCompleted(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!order) return;

    await DecisionTracer.record({
      agentKey: this.KEY,
      eventType: "POST_PURCHASE_RETENTION_SCHEDULE",
      customerId: order.customerId,
      entityType: "Order",
      entityId: order.id,
      context: {
        event: "Customer finished checkout",
        details: `Order total: ₹${order.total.toLocaleString("en-IN")}, items: ${order.items.length}`,
        previousOrders: order.customer.ordersCount,
      },
      intentScore: 95,
      riskLevel: "Low",
      optionsConsidered: [
        "Immediate generic feedback request",
        "Schedule day-7 setup guide + complementary warranty check",
        "Reorder consumable reminder at day 30",
      ],
      decision: "Scheduled Day-7 post-delivery onboarding nudge with priority tech support link.",
      confidence: 0.94,
      reasoning: "Maximizes post-purchase satisfaction without overwhelming customer immediately after payment.",
      status: "EXECUTED",
    });
  }
}
