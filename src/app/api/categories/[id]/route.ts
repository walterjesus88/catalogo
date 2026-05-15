import { NextRequest, NextResponse } from "next/server";
import { queryOne, runQuery, initDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  initDb();
  const category = queryOne("SELECT * FROM categories WHERE id = ?", [params.id]);
  if (!category) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  initDb();
  const body = await request.json();

  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  runQuery(
    "UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [body.name, slug, body.description || null, body.image_url || null, params.id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  initDb();
  runQuery("DELETE FROM categories WHERE id = ?", [params.id]);
  return NextResponse.json({ success: true });
}
