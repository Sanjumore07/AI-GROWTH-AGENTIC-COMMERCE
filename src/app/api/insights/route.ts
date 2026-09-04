import { NextResponse } from "next/server";
import { GrowthInsightsAgent } from "@/lib/ai/agents/growth-agent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const insights = await GrowthInsightsAgent.generateInsights();
    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    console.error("[API/insights] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
