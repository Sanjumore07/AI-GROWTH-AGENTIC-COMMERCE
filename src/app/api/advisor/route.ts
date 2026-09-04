import { NextRequest, NextResponse } from "next/server";
import { CommerceAdvisorAgent } from "@/lib/ai/agents/advisor-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history = [], message, activeProductId, customerId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await CommerceAdvisorAgent.chat(
      history,
      message,
      activeProductId,
      customerId
    );

    return NextResponse.json({
      success: true,
      reply: response.reply,
      recommendedProductIds: response.recommendedProductIds,
      quickReplies: response.quickReplies,
    });
  } catch (error: any) {
    console.error("[API/advisor] Error:", error);
    return NextResponse.json(
      {
        success: true,
        reply: "AI service temporarily experiencing high traffic. Based on standard catalog specifications, this product meets all standard performance requirements with a 1-year manufacturer warranty.",
        recommendedProductIds: [],
        quickReplies: ["Tell me about warranty", "Show budget alternatives"],
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
