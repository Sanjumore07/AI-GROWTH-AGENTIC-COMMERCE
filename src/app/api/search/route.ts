import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const [products, customers, orders, agents, carts] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { brand: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 5,
        include: { category: true },
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { segment: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q } },
            { paymentStatus: { contains: q } },
          ],
        },
        take: 5,
        include: { customer: true },
      }),
      prisma.aIAgent.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { role: { contains: q } },
            { key: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.cart.findMany({
        where: {
          AND: [
            { status: "ABANDONED" },
            { customer: { name: { contains: q } } },
          ],
        },
        take: 5,
        include: { customer: true },
      }),
    ]);

    const results = [
      ...products.map((p) => ({
        type: "Product",
        title: p.name,
        subtitle: `₹${p.price.toLocaleString("en-IN")} • ${p.category?.name || "General"}`,
        link: `/store/product/${p.slug}`,
      })),
      ...customers.map((c) => ({
        type: "Customer",
        title: c.name,
        subtitle: `${c.segment} • ₹${c.totalSpend.toLocaleString("en-IN")} Spend`,
        link: `/dashboard/customers/${c.id}`,
      })),
      ...orders.map((o) => ({
        type: "Order",
        title: `Order #${o.orderNumber}`,
        subtitle: `₹${o.total.toLocaleString("en-IN")} • ${o.customer?.name} • ${o.isAiInfluenced ? "AI-Influenced" : "Standard"}`,
        link: `/dashboard/orders`,
      })),
      ...agents.map((a) => ({
        type: "Agent",
        title: a.name,
        subtitle: `${a.role} • ${a.autonomyLevel}`,
        link: `/dashboard/agents/${a.key}`,
      })),
      ...carts.map((ct) => ({
        type: "Abandoned Cart",
        title: `Cart #${ct.id.slice(-6)} (${ct.customer?.name})`,
        subtitle: `₹${ct.total.toLocaleString("en-IN")} • Risk: ${ct.abandonmentRisk}`,
        link: `/dashboard/abandoned-carts`,
      })),
    ];

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("[API/search] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
