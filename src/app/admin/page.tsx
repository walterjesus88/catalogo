import { queryOne, initDb } from "@/lib/db";
import { Package, FolderOpen, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await initDb();

  const [
    productCount,
    categoryCount,
    totalValue,
    lowStock,
  ] = await Promise.all([
    await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM products"),
    await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM categories"),
    await queryOne<{ total: number }>("SELECT SUM(price * stock) as total FROM products WHERE is_active = 1"),
    await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND is_active = 1"),
  ]);

  const stats = [
    { label: "Productos", value: productCount?.count || 0, icon: Package, color: "text-primary", bg: "bg-primary-fixed" },
    { label: "Categorías", value: categoryCount?.count || 0, icon: FolderOpen, color: "text-on-primary-container", bg: "bg-primary-container" },
    { label: "Valor Inventario", value: `$${(totalValue?.total || 0).toFixed(2)}`, icon: DollarSign, color: "text-tertiary", bg: "bg-tertiary-fixed" },
    { label: "Stock Bajo", value: lowStock?.count || 0, icon: TrendingUp, color: "text-error", bg: "bg-error-container" },
  ];

  return (
    <div>
      <h1 className="text-lg sm:text-headline-md font-bold text-on-surface mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bento-tile p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">{stat.label}</p>
                <p className="text-headline-sm text-on-surface">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bento-tile p-6">
          <h2 className="text-headline-sm font-bold text-on-surface mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <a href="/admin/products/new" className="btn-bento text-center block">
              Agregar producto
            </a>
            <a href="/admin/categories/new" className="btn-bento-outline text-center block">
              Agregar categoría
            </a>
          </div>
        </div>

        <div className="bento-tile p-6 bg-surface-container rounded-bento">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-label-caps text-on-surface-variant mb-1">CATÁLOGO</p>
              <h2 className="text-headline-sm text-primary">{productCount?.count || 0} Productos</h2>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
          <p className="text-body-md text-on-surface-variant">
            {lowStock?.count || 0} productos con stock bajo (≤5 unidades).
          </p>
        </div>
      </div>
    </div>
  );
}
