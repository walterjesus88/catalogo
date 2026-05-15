import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne, runQuery, initDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let sql = "SELECT * FROM products WHERE is_active = 1";
  const params: unknown[] = [];

  if (category) {
    sql += " AND category_id = (SELECT id FROM categories WHERE slug = ?)";
    params.push(category);
  }

  if (q) {
    sql += " AND (name LIKE ? OR description LIKE ?)";
    const likeQ = `%${q}%`;
    params.push(likeQ, likeQ);
  }

  sql += " ORDER BY created_at DESC";

  const products = await queryAll(sql, params);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  await initDb();
  const body = await request.json();

  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const result = await runQuery<{ lastInsertRowid: number }>(
    `INSERT INTO products (name, slug, description, short_description, price, sale_price, sku, stock, category_id, image_url, is_featured, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.name, body.slug,
      body.description || null, body.short_description || null,
      parseFloat(body.price), body.sale_price ? parseFloat(body.sale_price) : null,
      body.sku || null, parseInt(body.stock) || 0,
      body.category_id ? parseInt(body.category_id) : null,
      body.image_url || null,
      body.is_featured ? 1 : 0,
      body.is_active !== false ? 1 : 0,
    ]
  );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
