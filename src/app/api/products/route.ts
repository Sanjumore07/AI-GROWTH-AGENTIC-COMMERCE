import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const category = req.nextUrl.searchParams.get("category");

    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = { name: category };
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("[API/products] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
