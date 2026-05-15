import { NextRequest, NextResponse } from "next/server";
import { runQuery, initDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const { product_id, product_name, phone } = await request.json();

    await runQuery(
      "INSERT INTO contact_logs (product_id, product_name, phone) VALUES (?, ?, ?)",
      [product_id || null, product_name, phone || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact log error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
