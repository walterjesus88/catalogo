import { NextRequest, NextResponse } from "next/server";
import { queryAll, runQuery, initDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const categories = await queryAll("SELECT * FROM categories ORDER BY name");
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  await initDb();
  const body = await request.json();

  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const result = await runQuery<{ lastInsertRowid: number }>(
    "INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)",
    [body.name, slug, body.description || null, body.image_url || null]
  );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
