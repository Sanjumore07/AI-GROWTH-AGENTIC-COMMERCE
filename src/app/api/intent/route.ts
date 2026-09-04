import { NextRequest, NextResponse } from "next/server";
import { CommerceOrchestrator } from "@/lib/ai/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, customerId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const result = await CommerceOrchestrator.handleIntentQuery(query, customerId);

    return NextResponse.json({
      success: true,
      intent: result.intent,
      recommendations: result.recommendations,
      customerProfile: result.customerProfile,
    });
  } catch (error: any) {
    console.error("[API/intent] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process shopping intent" }, { status: 500 });
  }
}
