import { NextRequest, NextResponse } from "next/server";
import { CartRecoveryAgent } from "@/lib/ai/agents/recovery-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, action = "EXECUTE" } = body;

    if (!cartId) {
      return NextResponse.json({ error: "cartId is required" }, { status: 400 });
    }

    if (action === "ANALYZE") {
      const decision = await CartRecoveryAgent.analyze(cartId);
      return NextResponse.json({ success: true, decision });
    }

    if (action === "EXECUTE") {
      const result = await CartRecoveryAgent.executeRecovery(cartId);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[API/recovery] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
