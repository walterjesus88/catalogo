import { queryOne, queryAll, initDb } from "@/lib/db";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await initDb();
  const product = await queryOne<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    sku: string | null;
    stock: number;
    category_id: number | null;
    image_url: string | null;
    is_featured: number;
    is_active: number;
  }>("SELECT * FROM products WHERE id = ?", [params.id]);

  if (!product) notFound();

  const categories = await queryAll<{ id: number; name: string; slug: string }>(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );

  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Editar Producto</h1>
      <div className="bento-tile p-6">
        <ProductForm
          categories={categories}
          initialData={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            short_description: product.short_description || "",
            price: product.price.toString(),
            sale_price: product.sale_price?.toString() || "",
            sku: product.sku || "",
            stock: product.stock.toString(),
            category_id: product.category_id?.toString() || "",
            image_url: product.image_url || "",
            is_featured: product.is_featured === 1,
            is_active: product.is_active === 1,
          }}
        />
      </div>
    </div>
  );
}
