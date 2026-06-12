import { queryAll, queryOne, initDb } from "@/lib/db";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContacts() {
  await initDb();

  const total = await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contact_logs") || { count: 0 };
  const today = await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contact_logs WHERE date(created_at) = date('now')") || { count: 0 };

  const topProducts = await queryAll<{ product_name: string; count: number }>(
    "SELECT product_name, COUNT(*) as count FROM contact_logs GROUP BY product_name ORDER BY count DESC LIMIT 5"
  );

  const logs = await queryAll<{ id: number; product_name: string; created_at: string }>(
    "SELECT id, product_name, created_at FROM contact_logs ORDER BY created_at DESC LIMIT 50"
  );

  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Contactos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-primary-fixed">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Total contactos</p>
              <p className="text-headline-sm text-on-surface">{total.count}</p>
            </div>
          </div>
        </div>
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-primary-container">
              <MessageSquare className="h-6 w-6 text-on-primary-container" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Hoy</p>
              <p className="text-headline-sm text-on-surface">{today.count}</p>
            </div>
          </div>
        </div>
        <div className="bento-tile p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl p-3 bg-surface-container-highest">
              <MessageSquare className="h-6 w-6 text-on-surface-variant" />
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Productos consultados</p>
              <p className="text-headline-sm text-on-surface">{topProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="bento-tile p-6 mb-8">
          <h2 className="text-headline-sm font-bold text-on-surface mb-4">Productos más consultados</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.product_name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-label-caps text-on-surface-variant w-6">{i + 1}.</span>
                  <span className="text-body-md text-on-surface">{p.product_name}</span>
                </div>
                <span className="chip bg-primary-fixed text-on-primary-fixed">{p.count} consultas</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bento-tile overflow-x-auto">
        <h2 className="text-headline-sm font-bold text-on-surface p-6 pb-0">Últimos contactos</h2>
        <table className="min-w-full divide-y divide-outline-variant/30 mt-4">
          <thead className="bg-surface-container-highest">
            <tr>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/20">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <span className="text-body-md text-on-surface">{log.product_name}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-body-md text-on-surface-variant">
                    {new Date(log.created_at).toLocaleDateString("es-PE", {
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

        {logs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-lg text-on-surface-variant">Aún no hay contactos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
