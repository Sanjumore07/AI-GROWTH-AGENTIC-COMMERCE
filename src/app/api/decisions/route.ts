import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const agentKey = req.nextUrl.searchParams.get("agentKey");
    const customerId = req.nextUrl.searchParams.get("customerId");

    if (id) {
      const decision = await prisma.aIDecision.findUnique({
        where: { id },
        include: { customer: true },
      });
      return NextResponse.json({ success: true, decision });
    }

    const where: any = {};
    if (agentKey) where.agentKey = agentKey;
    if (customerId) where.customerId = customerId;

    const decisions = await prisma.aIDecision.findMany({
      where,
      include: { customer: true },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, decisions });
  } catch (error: any) {
    console.error("[API/decisions GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
