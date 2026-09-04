import { aiEngine } from "../index";
import { DecisionTracer } from "../decision-tracer";
import { CartRecoveryDecision } from "../types";
import { prisma } from "../../prisma";

export class CartRecoveryAgent {
  static readonly KEY = "RECOVERY";

  static async analyze(cartId: string): Promise<CartRecoveryDecision> {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!cart) {
      throw new Error(`Cart ${cartId} not found`);
    }

    const events = await prisma.customerEvent.findMany({
      where: { customerId: cart.customerId || undefined },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    const decision = await aiEngine.evaluateCartRecovery(cart, cart.customer, events);

    // Save decision trace
    await DecisionTracer.record({
      agentKey: this.KEY,
      eventType: "CART_ABANDONMENT_EVALUATION",
      customerId: cart.customerId || undefined,
      entityType: "Cart",
      entityId: cart.id,
      context: {
        event: `Customer abandoned ₹${cart.total.toLocaleString("en-IN")} cart`,
        details: `Customer viewed item multiple times. Inactive for > 15 minutes.`,
        cartValue: cart.total,
      },
      intentScore: decision.intentScore,
      riskLevel: decision.abandonmentRisk,
      optionsConsidered: [
        "1. Margin-diluting 15% discount coupon",
        "2. Personalized stock-urgency reminder (Zero discount)",
        "3. Alternative cheaper product suggestion",
        "4. No action",
      ],
      decision: decision.recommendedAction,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
      requiresApproval: decision.requiresApproval,
      status: decision.requiresApproval ? "PENDING_APPROVAL" : "EXECUTED",
    });

    // Update cart status with recommended action
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        recoveryAction: decision.recommendedAction,
        recoveryStatus: "PENDING",
      },
    });

    return decision;
  }

  /**
   * Hero Simulation Action: Execute recovery for an abandoned cart
   */
  static async executeRecovery(cartId: string): Promise<{
    success: boolean;
    recoveredAmount: number;
    orderId: string;
    message: string;
  }> {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });

    if (!cart || !cart.customer) {
      throw new Error("Valid cart and customer required for recovery execution.");
    }

    const recoveredAmount = cart.total > 0 ? cart.total : 74999;
    const orderNumber = `ORD-REC-${Date.now().toString().slice(-6)}`;

    // Create completed order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: cart.customer.id,
        status: "COMPLETED",
        subtotal: recoveredAmount,
        discount: cart.discount || 0,
        shipping: 0,
        total: recoveredAmount,
        currency: "INR",
        paymentMethod: "UPI (Razorpay Sim)",
        paymentStatus: "PAID",
        isAiInfluenced: true,
        aiInfluenceType: "RECOVERED_CART",
        shippingAddress: JSON.stringify({
          street: "12/4 Cyber City",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560103",
        }),
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.priceAtAdd,
            totalPrice: item.priceAtAdd * item.quantity,
          })),
        },
      },
    });

    // Update cart state
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        status: "RECOVERED",
        recoveryStatus: "RECOVERED",
      },
    });

    // Update Customer profile
    await prisma.customer.update({
      where: { id: cart.customer.id },
      data: {
        ordersCount: { increment: 1 },
        totalSpend: { increment: recoveredAmount },
        lastActiveAt: new Date(),
      },
    });

    // Update Agent revenue attribution
    await prisma.aIAgent.updateMany({
      where: { key: this.KEY },
      data: {
        revenueInfluenced: { increment: recoveredAmount },
        successfulActions: { increment: 1 },
      },
    });

    // Log to DecisionTrace outcome
    await prisma.aIDecision.create({
      data: {
        agentKey: this.KEY,
        eventType: "RECOVERY_CONVERSION_SUCCESS",
        customerId: cart.customer.id,
        entityType: "Order",
        entityId: order.id,
        contextJson: JSON.stringify({
          cartId: cart.id,
          originalCartValue: recoveredAmount,
          customerName: cart.customer.name,
        }),
        intentScore: 95,
        riskLevel: "Low",
        optionsConsideredJson: JSON.stringify(["Complete Conversion", "Follow up with CSAT"]),
        decision: `Successfully converted abandoned cart into Order #${orderNumber}`,
        confidence: 0.98,
        reasoning: "Customer returned via AI personalized nudge, bypassed price hesitation, and completed Razorpay checkout.",
        status: "EXECUTED",
        outcome: `Customer returned and purchased ₹${recoveredAmount.toLocaleString("en-IN")}`,
        revenueImpact: recoveredAmount,
      },
    });

    // Emit live notification
    await prisma.notification.create({
      data: {
        title: `AI Recovered ₹${recoveredAmount.toLocaleString("en-IN")}!`,
        message: `Cart Recovery Agent successfully converted ${cart.customer.name}'s abandoned cart into Order #${orderNumber}.`,
        type: "SUCCESS",
        link: `/dashboard/orders`,
      },
    });

    return {
      success: true,
      recoveredAmount,
      orderId: order.id,
      message: `Successfully recovered ₹${recoveredAmount.toLocaleString("en-IN")} via AI personalized nudge!`,
    };
  }
}
