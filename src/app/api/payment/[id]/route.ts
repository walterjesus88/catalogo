import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import { queryOne, transaction, initDb } from "@/lib/db";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initDb();
    const paymentId = parseInt(params.id);
    if (isNaN(paymentId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const payment = queryOne<{
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

    transaction((db: Database.Database) => {
      if (payment.product_id) {
        const product = db.prepare(
          "SELECT id, stock, name FROM products WHERE id = ?"
        ).get(payment.product_id) as { id: number; stock: number; name: string } | undefined;

        if (product && product.stock > 0) {
          db.prepare(
            "UPDATE products SET stock = stock - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock > 0"
          ).run(payment.product_id);
        }
      }

      db.prepare(
        "UPDATE payment_logs SET status = 'confirmed' WHERE id = ?"
      ).run(paymentId);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
