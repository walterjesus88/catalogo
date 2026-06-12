import { queryAll, initDb } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: { sku?: string };
}) {
  await initDb();
  const categories = await queryAll<{ id: number; name: string; slug: string }>(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );

  const initialData = searchParams.sku
    ? { sku: searchParams.sku, name: "", slug: "", description: "", short_description: "", price: "", sale_price: "", stock: "0", category_id: "", image_url: "", is_featured: false, is_active: true }
    : undefined;

  return (
    <div>
      <h1 className="text-lg sm:text-headline-md font-bold text-on-surface mb-6 sm:mb-8">
        {searchParams.sku ? `Nuevo producto (SKU: ${searchParams.sku})` : "Nuevo Producto"}
      </h1>
      <div className="bento-tile p-6">
        <ProductForm categories={categories} isNew initialData={initialData} />
      </div>
    </div>
  );
}
