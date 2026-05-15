import { queryAll, queryOne, initDb } from "@/lib/db";
import { Wallet, CheckCircle, Clock } from "lucide-react";
import ConfirmPaymentButton from "./ConfirmPaymentButton";

export const dynamic = "force-dynamic";

export default async function AdminPayments() {
  initDb();

  const total = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM payment_logs") || { count: 0 };
  const pending = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM payment_logs WHERE status = 'pending'") || { count: 0 };
  const totalAmount = queryOne<{ total: number }>("SELECT SUM(amount) as total FROM payment_logs") || { total: 0 };

  const payments = queryAll<{
    id: number;
    product_name: string;
    amount: number;
    method: string;
    status: string;
    created_at: string;
  }>("SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 50");

  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Pagos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-primary-fixed">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Total pagos</p>
              <p className="text-headline-sm text-on-surface">{total.count}</p>
            </div>
          </div>
        </div>
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-error-container">
              <Clock className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Pendientes</p>
              <p className="text-headline-sm text-on-surface">{pending.count}</p>
            </div>
          </div>
        </div>
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-primary-container">
              <CheckCircle className="h-6 w-6 text-on-primary-container" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Monto total</p>
              <p className="text-headline-sm text-on-surface">S/ {totalAmount.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-tile overflow-hidden">
        <h2 className="text-headline-sm font-bold text-on-surface p-6 pb-0">Historial de pagos</h2>
        <table className="min-w-full divide-y divide-outline-variant/30 mt-4">
          <thead className="bg-surface-container-highest">
            <tr>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Método</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant uppercase tracking-wider">Acción</th>
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/20">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <span className="text-body-md text-on-surface">{p.product_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-body-md font-medium text-on-surface">S/ {p.amount.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="chip bg-primary-fixed text-on-primary-fixed uppercase">{p.method}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`chip ${p.status === "pending" ? "bg-error-container text-error" : "bg-primary-fixed text-on-primary-fixed"}`}>
                    {p.status === "pending" ? "Pendiente" : "Confirmado"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {p.status === "pending" ? (
                    <ConfirmPaymentButton paymentId={p.id} />
                  ) : (
                    <span className="text-xs text-on-surface-variant">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-body-md text-on-surface-variant">
                    {new Date(p.created_at).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-lg text-on-surface-variant">Aún no hay pagos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
