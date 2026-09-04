import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.aIAgent.findMany({
      orderBy: { totalExecutions: "desc" },
    });
    return NextResponse.json({ success: true, agents });
  } catch (error: any) {
    console.error("[API/agents GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, autonomyLevel, confidenceThreshold, status } = body;

    if (!key) {
      return NextResponse.json({ error: "Agent key is required" }, { status: 400 });
    }

    const updated = await prisma.aIAgent.update({
      where: { key },
      data: {
        ...(autonomyLevel ? { autonomyLevel } : {}),
        ...(confidenceThreshold !== undefined ? { confidenceThreshold } : {}),
        ...(status ? { status } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        actor: "Merchant Admin",
        agentKey: key,
        action: `Updated configuration for ${updated.name}`,
        outcome: "Success",
        details: `Autonomy: ${updated.autonomyLevel}, Threshold: ${updated.confidenceThreshold}, Status: ${updated.status}`,
      },
    });

    return NextResponse.json({ success: true, agent: updated });
  } catch (error: any) {
    console.error("[API/agents PATCH] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
