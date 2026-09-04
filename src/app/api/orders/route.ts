import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 120,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("[API/orders] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
