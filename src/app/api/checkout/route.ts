import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentService } from "@/lib/payment-service";
import { CustomerRetentionAgent } from "@/lib/ai/agents/retention-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cartId,
      customerId,
      customerDetails,
      shippingAddress,
      paymentMethod = "UPI (Razorpay Sim)",
      paymentSimulationId,
    } = body;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty or not found" }, { status: 400 });
    }

    // Resolve or create customer
    let customer = customerId ? await prisma.customer.findUnique({ where: { id: customerId } }) : null;

    if (!customer) {
      const email = customerDetails?.email || `shopper_${Date.now()}@example.in`;
      customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerDetails?.name || "Guest Shopper",
            email,
            phone: customerDetails?.phone || "+91 98765 43210",
            segment: "High Intent",
            priceSensitivity: "Medium",
          },
        });
      }
    }

    // Process payment verification through PaymentService
    const paymentResult = await PaymentService.verifyPayment({
      orderId: `order_sim_${Date.now()}`,
      paymentId: paymentSimulationId || `pay_sim_${Date.now()}`,
      method: paymentMethod,
    });

    const orderNumber = `ORD-${Date.now().toString().slice(-7)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "COMPLETED",
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        total: cart.total,
        currency: "INR",
        paymentMethod,
        paymentStatus: "PAID",
        isAiInfluenced: cart.discount > 0 || cart.status === "RECOVERED",
        aiInfluenceType: cart.status === "RECOVERED" ? "RECOVERED_CART" : "INTENT_RECOMMENDATION",
        shippingAddress: JSON.stringify(shippingAddress || { city: "Bengaluru", state: "Karnataka" }),
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.priceAtAdd,
            totalPrice: item.priceAtAdd * item.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Mark cart as converted
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: "CONVERTED" },
    });

    // Clear cart items
    await prisma.cartItem.deleteMany({ where: { cartId } });

    // Update Customer statistics
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        ordersCount: { increment: 1 },
        totalSpend: { increment: cart.total },
        lastActiveAt: new Date(),
      },
    });

    // Trigger Retention Agent
    await CustomerRetentionAgent.onPurchaseCompleted(order.id);

    // Create activity log
    await prisma.activityLog.create({
      data: {
        actor: "Smart Checkout",
        action: `Order #${orderNumber} completed (Razorpay Simulation)`,
        entityType: "Order",
        entityId: order.id,
        outcome: "Success",
        details: `Customer ${customer.name} paid ₹${cart.total.toLocaleString("en-IN")} via ${paymentMethod}`,
      },
    });

    return NextResponse.json({
      success: true,
      order,
      paymentResult,
      message: "Order placed successfully in Razorpay Simulation Mode!",
    });
  } catch (error: any) {
    console.error("[API/checkout] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
