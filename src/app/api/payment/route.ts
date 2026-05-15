import { NextRequest, NextResponse } from "next/server";
import { runQuery, initDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    initDb();
    const { product_id, product_name, amount } = await request.json();

    runQuery(
      "INSERT INTO payment_logs (product_id, product_name, amount, method, status) VALUES (?, ?, ?, 'yape', 'pending')",
      [product_id || null, product_name, amount]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment log error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
