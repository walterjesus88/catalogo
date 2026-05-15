import Link from "next/link";
import { queryAll, initDb } from "@/lib/db";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  product_count: number;
}

export default async function AdminCategories() {
  initDb();
  const categories = queryAll<Category>(
    `SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
     FROM categories c ORDER BY c.name`
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-headline-md font-bold text-on-surface">Categorías</h1>
        <Link href="/admin/categories/new" className="btn-bento w-auto px-6 py-3">
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Link>
      </div>

      <div className="bento-tile overflow-hidden">
        <table className="min-w-full divide-y divide-outline-variant/30">
          <thead className="bg-surface-container-highest">
            <tr>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/20">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4">
                  <div className="text-body-md font-medium text-on-surface">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-on-surface-variant truncate max-w-[300px]">{category.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-body-md text-on-surface-variant font-mono text-sm">{category.slug}</td>
                <td className="px-6 py-4 text-body-md text-on-surface">{category.product_count}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${category.id}/edit`} className="text-primary hover:text-primary-container p-2 rounded-lg hover:bg-primary-fixed transition-colors">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <form action={`/api/categories/${category.id}`} method="POST" className="inline">
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

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-lg text-on-surface-variant">No hay categorías registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
