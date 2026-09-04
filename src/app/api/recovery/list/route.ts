import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const carts = await prisma.cart.findMany({
      where: {
        OR: [
          { status: "ABANDONED" },
          { status: "RECOVERED" },
        ],
      },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, carts });
  } catch (error: any) {
    console.error("[API/recovery/list] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
