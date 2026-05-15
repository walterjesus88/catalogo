import { NextRequest, NextResponse } from "next/server";
import { queryOne, runQuery, initDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initDb();
  const product = await queryOne("SELECT * FROM products WHERE id = ?", [params.id]);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initDb();
  const body = await request.json();

  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  await runQuery(
    `UPDATE products SET name = ?, slug = ?, description = ?, short_description = ?, price = ?, sale_price = ?, sku = ?, stock = ?, category_id = ?, image_url = ?, is_featured = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      body.name,
      slug,
      body.description || null,
      body.short_description || null,
      parseFloat(body.price) || 0,
      body.sale_price ? parseFloat(body.sale_price) : null,
      body.sku || null,
      parseInt(body.stock) || 0,
      body.category_id ? parseInt(body.category_id) : null,
      body.image_url || null,
      body.is_featured ? 1 : 0,
      body.is_active !== false ? 1 : 0,
      params.id,
    ]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initDb();
  await runQuery("DELETE FROM products WHERE id = ?", [params.id]);
  return NextResponse.json({ success: true });
}
