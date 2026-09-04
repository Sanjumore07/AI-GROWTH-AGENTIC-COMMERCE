import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pending = await prisma.aIDecision.findMany({
      where: {
        OR: [
          { status: "PENDING_APPROVAL" },
          { requiresApproval: true },
        ],
      },
      include: { customer: true },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({ success: true, approvals: pending });
  } catch (error: any) {
    console.error("[API/approvals GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { decisionId, action, modifiedNotes, reviewerName = "Merchant Admin" } = body;

    if (!decisionId || !action) {
      return NextResponse.json({ error: "decisionId and action are required" }, { status: 400 });
    }

    const decision = await prisma.aIDecision.findUnique({ where: { id: decisionId } });
    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    const newStatus = action === "APPROVE" ? "EXECUTED" : action === "REJECT" ? "REJECTED" : "EXECUTED";
    const updated = await prisma.aIDecision.update({
      where: { id: decisionId },
      data: {
        status: newStatus,
        approvedBy: reviewerName,
        approvedAt: new Date(),
        outcome: action === "APPROVE"
          ? "Manually approved by merchant. Executed with high confidence."
          : action === "REJECT"
          ? "Rejected by merchant. Reverted to standard catalog pricing."
          : `Modified by merchant: ${modifiedNotes || "Adjusted parameters"}`,
      },
    });

    // Log to activity log
    await prisma.activityLog.create({
      data: {
        actor: reviewerName,
        agentKey: decision.agentKey,
        action: `${action} decision #${decisionId.slice(-6)}`,
        entityType: decision.entityType,
        entityId: decision.entityId,
        outcome: action,
        details: `Merchant ${action.toLowerCase()}ed AI proposal: ${decision.decision}`,
      },
    });

    return NextResponse.json({ success: true, decision: updated });
  } catch (error: any) {
    console.error("[API/approvals POST] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
