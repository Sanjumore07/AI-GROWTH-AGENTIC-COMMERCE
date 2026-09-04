import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CartRecoveryAgent } from "@/lib/ai/agents/recovery-agent";
import { ShoppingIntentAgent } from "@/lib/ai/agents/intent-agent";
import { ProductDiscoveryAgent } from "@/lib/ai/agents/discovery-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenario = "HERO_RECOVERY", step } = body;

    // 1. HERO SCENARIO: RAHUL SHARMA FLOW
    if (scenario === "HERO_RECOVERY") {
      let rahul = await prisma.customer.findFirst({
        where: { email: { contains: "rahul.sharma" } },
      });

      if (!rahul) {
        rahul = await prisma.customer.create({
          data: {
            name: "Rahul Sharma",
            email: "rahul.sharma@example.in",
            phone: "+91 98201 44521",
            segment: "High Intent",
            priceSensitivity: "Low",
            purchaseProbability: 0.92,
          },
        });
      }

      const laptop = await prisma.product.findFirst({
        where: { name: { contains: "Zenith Pro 16" } },
      }) || (await prisma.product.findFirst());

      if (!laptop) {
        return NextResponse.json({ error: "No products found in database" }, { status: 500 });
      }

      if (step === "INTENT_SEARCH") {
        const query = "I need a laptop for coding and college under ₹80,000";
        const intent = await ShoppingIntentAgent.process(query, rahul.id);
        const recommendations = await ProductDiscoveryAgent.discover(intent, rahul.id);

        return NextResponse.json({
          success: true,
          step: "INTENT_SEARCH",
          customer: rahul,
          query,
          intent,
          topRecommendation: recommendations[0],
          message: "Shopping Intent Agent extracted budget (₹80,000) and priorities. Product Discovery Agent ranked Zenith Pro 16 as 94% match.",
        });
      }

      if (step === "ABANDON_CART") {
        let cart = await prisma.cart.findFirst({
          where: { customerId: rahul.id },
          include: { items: true },
        });

        if (!cart) {
          cart = await prisma.cart.create({
            data: {
              customerId: rahul.id,
              sessionId: `session_hero_${Date.now()}`,
              subtotal: laptop.price,
              total: laptop.price,
              status: "ABANDONED",
              intentScore: 92,
              abandonmentRisk: "High",
              recoveryAction: "Personalized Reminder (No Discount)",
              recoveryStatus: "PENDING",
              abandonedAt: new Date(),
              items: {
                create: [{ productId: laptop.id, quantity: 1, priceAtAdd: laptop.price }],
              },
            },
            include: { items: true },
          });
        } else {
          await prisma.cart.update({
            where: { id: cart.id },
            data: {
              status: "ABANDONED",
              recoveryStatus: "PENDING",
              total: laptop.price,
              abandonedAt: new Date(),
            },
          });
        }

        const analysis = await CartRecoveryAgent.analyze(cart.id);

        return NextResponse.json({
          success: true,
          step: "ABANDON_CART",
          cartId: cart.id,
          cartValue: cart.total,
          intentScore: 92,
          risk: "High",
          decision: analysis.recommendedAction,
          reasoning: analysis.reasoning,
          message: "Customer abandoned ₹74,999 cart. AI analyzed 4 prior product views and decided: Do NOT discount; send personalized stock urgency reminder.",
        });
      }

      if (step === "EXECUTE_RECOVERY") {
        const cart = await prisma.cart.findFirst({
          where: { customerId: rahul.id },
          orderBy: { updatedAt: "desc" },
        });

        if (!cart) {
          return NextResponse.json({ error: "Cart not found for recovery" }, { status: 404 });
        }

        const result = await CartRecoveryAgent.executeRecovery(cart.id);

        return NextResponse.json({
          success: true,
          step: "EXECUTE_RECOVERY",
          recoveredAmount: result.recoveredAmount,
          orderId: result.orderId,
          message: result.message,
        });
      }

      // If full hero simulation triggered in one action:
      let cart = await prisma.cart.findFirst({
        where: { customerId: rahul.id, status: "ABANDONED" },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            customerId: rahul.id,
            sessionId: `session_hero_${Date.now()}`,
            subtotal: laptop.price,
            total: laptop.price,
            status: "ABANDONED",
            intentScore: 92,
            abandonmentRisk: "High",
            recoveryAction: "Personalized Reminder (No Discount)",
            recoveryStatus: "PENDING",
            abandonedAt: new Date(),
            items: {
              create: [{ productId: laptop.id, quantity: 1, priceAtAdd: laptop.price }],
            },
          },
        });
      }

      const recoveryResult = await CartRecoveryAgent.executeRecovery(cart.id);

      return NextResponse.json({
        success: true,
        scenario: "HERO_RECOVERY",
        customer: rahul.name,
        recoveredAmount: recoveryResult.recoveredAmount,
        orderId: recoveryResult.orderId,
        message: `Rahul Sharma returned via AI reminder and completed purchase! Recovered ₹${recoveryResult.recoveredAmount.toLocaleString("en-IN")}.`,
      });
    }

    // 2. RANDOM SHOPPER VISIT SIMULATION
    if (scenario === "RANDOM_VISIT") {
      const customers = await prisma.customer.findMany({ take: 10 });
      const products = await prisma.product.findMany({ take: 10 });
      const randomCust = customers[Math.floor(Math.random() * customers.length)];
      const randomProd = products[Math.floor(Math.random() * products.length)];

      await prisma.customerEvent.create({
        data: {
          customerId: randomCust.id,
          sessionId: `sim_session_${Date.now()}`,
          eventType: "PRODUCT_VIEW",
          eventData: JSON.stringify({
            productId: randomProd.id,
            productName: randomProd.name,
            price: randomProd.price,
          }),
        },
      });

      await prisma.activityLog.create({
        data: {
          actor: "Storefront Simulation",
          action: `Customer ${randomCust.name} viewed ${randomProd.name}`,
          entityType: "Product",
          entityId: randomProd.id,
          outcome: "Viewed",
          details: `Simulated engagement on ${randomProd.name} (₹${randomProd.price.toLocaleString("en-IN")})`,
        },
      });

      return NextResponse.json({
        success: true,
        scenario: "RANDOM_VISIT",
        customer: randomCust.name,
        product: randomProd.name,
        message: `Simulated shopper visit: ${randomCust.name} explored ${randomProd.name}`,
      });
    }

    return NextResponse.json({ error: "Unknown scenario" }, { status: 400 });
  } catch (error: any) {
    console.error("[API/simulation] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
