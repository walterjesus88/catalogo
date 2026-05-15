import Link from "next/link";
import { queryAll, initDb } from "@/lib/db";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  stock: number;
  sku: string | null;
  is_active: number;
  category_id: number | null;
}

export default async function AdminProducts() {
  initDb();
  const products = queryAll<Product>("SELECT * FROM products ORDER BY created_at DESC");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-headline-md font-bold text-on-surface">Productos</h1>
        <Link href="/admin/products/new" className="btn-bento w-auto px-6 py-3">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Link>
      </div>

      <div className="bento-tile overflow-hidden">
        <table className="min-w-full divide-y divide-outline-variant/30">
          <thead className="bg-surface-container-highest">
            <tr>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/20">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="text-body-md font-medium text-on-surface">{product.name}</div>
                  <div className="text-sm text-on-surface-variant truncate max-w-[200px]">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-body-md text-on-surface-variant">{product.sku || "-"}</td>
                <td className="px-6 py-4">
                  <div className="text-body-md font-medium text-on-surface">${product.price.toFixed(2)}</div>
                  {product.sale_price && (
                    <div className="text-sm text-error">${product.sale_price.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-body-md font-medium ${product.stock <= 5 ? "text-error" : "text-on-surface"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`chip ${product.is_active ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    {product.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-primary hover:text-primary-container p-2 rounded-lg hover:bg-primary-fixed transition-colors">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <form action={`/api/products/${product.id}`} method="POST" className="inline">
                      <input type="hidden" name="_method" value="DELETE" />
                      <button type="submit" className="text-error hover:text-error-container p-2 rounded-lg hover:bg-error-container transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-lg text-on-surface-variant">No hay productos registrados</p>
            <Link href="/admin/products/new" className="mt-4 text-primary hover:underline inline-block">
              Agregar el primer producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
