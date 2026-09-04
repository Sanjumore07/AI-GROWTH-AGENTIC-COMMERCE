import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("[API/activity] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
