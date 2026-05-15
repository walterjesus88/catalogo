import { NextRequest, NextResponse } from "next/server";
import { queryOne, runQuery, initDb } from "@/lib/db";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDb();
    const paymentId = parseInt(params.id);
    if (isNaN(paymentId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const payment = await queryOne<{
      id: number;
      product_id: number | null;
      status: string;
    }>("SELECT id, product_id, status FROM payment_logs WHERE id = ?", [paymentId]);

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    if (payment.status === "confirmed") {
      return NextResponse.json({ error: "Este pago ya fue confirmado" }, { status: 400 });
    }

    if (payment.product_id) {
      const product = await queryOne<{ id: number; stock: number; name: string }>(
        "SELECT id, stock, name FROM products WHERE id = ?",
        [payment.product_id]
      );

      if (product && product.stock > 0) {
        await runQuery(
          "UPDATE products SET stock = stock - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock > 0",
          [payment.product_id]
        );
      }
    }

    await runQuery(
      "UPDATE payment_logs SET status = 'confirmed' WHERE id = ?",
      [paymentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
