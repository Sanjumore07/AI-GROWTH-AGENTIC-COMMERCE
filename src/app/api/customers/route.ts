import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: { orderBy: { createdAt: "desc" }, take: 10 },
          carts: { include: { items: { include: { product: true } } } },
          events: { orderBy: { timestamp: "desc" }, take: 15 },
          decisions: { orderBy: { timestamp: "desc" }, take: 10 },
        },
      });

      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, customer });
    }

    const customers = await prisma.customer.findMany({
      orderBy: { totalSpend: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    console.error("[API/customers] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
