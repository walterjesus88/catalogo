import { queryAll, initDb } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  initDb();
  const categories = queryAll<{ id: number; name: string; slug: string }>(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );

  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Nuevo Producto</h1>
      <div className="bento-tile p-6">
        <ProductForm categories={categories} isNew />
      </div>
    </div>
  );
}
