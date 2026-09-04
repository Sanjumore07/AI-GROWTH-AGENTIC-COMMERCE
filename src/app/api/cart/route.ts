import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommerceOrchestrator } from "@/lib/ai/agents/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId") || "default_session";
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });

    if (!cart) {
      try {
        cart = await prisma.cart.create({
          data: {
            sessionId,
            status: "ACTIVE",
          },
          include: {
            items: {
              include: {
                product: { include: { category: true } },
              },
            },
          },
        });
      } catch (e) {
        cart = await prisma.cart.findUnique({
          where: { sessionId },
          include: {
            items: {
              include: {
                product: { include: { category: true } },
              },
            },
          },
        });
      }
    }

    if (!cart) {
      return NextResponse.json({ error: "Failed to initialize cart" }, { status: 500 });
    }

    // Trigger proactive Upsell & Offer evaluations via Orchestrator
    const { upsells, offer } = await CommerceOrchestrator.handleCartReview(
      cart.id,
      cart.items
    );

    return NextResponse.json({
      cart,
      upsells,
      offer,
    });
  } catch (error: any) {
    console.error("[API/cart GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId = "default_session", productId, quantity = 1, cartItemId } = body;

    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId, status: "ACTIVE" },
        include: { items: true },
      });
    }

    if (action === "ADD") {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const existingItem = cart.items.find((i) => i.productId === productId);
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            priceAtAdd: product.price,
          },
        });
      }
    } else if (action === "REMOVE") {
      if (cartItemId) {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
      }
    } else if (action === "CLEAR") {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    // Recalculate totals
    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: { include: { category: true } } },
    });

    const subtotal = updatedItems.reduce((acc, item) => acc + item.priceAtAdd * item.quantity, 0);
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        subtotal,
        total: subtotal,
        lastActivityAt: new Date(),
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });

    const { upsells, offer } = await CommerceOrchestrator.handleCartReview(
      updatedCart.id,
      updatedCart.items
    );

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      upsells,
      offer,
    });
  } catch (error: any) {
    console.error("[API/cart POST] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
