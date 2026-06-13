import { notFound } from "next/navigation";
import { queryAll, queryOne, initDb } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

interface Product {
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
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await initDb();

  const product = await queryOne<Product>("SELECT * FROM products WHERE id = ?", [params.id]);
  if (!product) notFound();

  const categories = await queryAll<{ id: number; name: string; slug: string }>(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    short_description: product.short_description || "",
    price: String(product.price),
    sale_price: product.sale_price ? String(product.sale_price) : "",
    sku: product.sku || "",
    stock: String(product.stock),
    category_id: product.category_id ? String(product.category_id) : "",
    image_url: product.image_url || "",
    is_featured: !!product.is_featured,
    is_active: !!product.is_active,
  };

  return (
    <div>
      <h1 className="text-lg sm:text-headline-md font-bold text-on-surface mb-6 sm:mb-8">
        Editar Producto
      </h1>
      <div className="bento-tile p-6">
        <ProductForm categories={categories} initialData={initialData} />
      </div>
    </div>
  );
}
