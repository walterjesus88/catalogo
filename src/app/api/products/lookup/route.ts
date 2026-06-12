import { NextRequest, NextResponse } from "next/server";
import { queryOne, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku");
  if (!sku) {
    return NextResponse.json({ error: "sku required" }, { status: 400 });
  }

  await initDb();
  const product = await queryOne<{
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    category_id: number | null;
  }>("SELECT id, name, slug, sku, price, stock, category_id FROM products WHERE sku = ?", [sku]);

  return NextResponse.json({ found: !!product, product });
}
