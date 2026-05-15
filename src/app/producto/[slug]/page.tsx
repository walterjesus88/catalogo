import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { queryOne, queryAll, initDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, Zap, Truck } from "lucide-react";
import ContactButton from "@/components/ContactButton";
import YapeButton from "@/components/YapeButton";

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
  image_url: string | null;
  category_id: number | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getProduct(slug: string): Promise<(Product & { category_name: string | null; category_slug: string | null }) | null> {
  await initDb();
  return await queryOne<Product & { category_name: string | null; category_slug: string | null }>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.is_active = 1`,
    [slug]
  );
}

async function getRelatedProducts(categoryId: number, currentId: number, limit = 4): Promise<Product[]> {
  return await queryAll<Product>(
    "SELECT * FROM products WHERE category_id = ? AND id != ? AND is_active = 1 ORDER BY RANDOM() LIMIT ?",
    [categoryId, currentId, limit]
  );
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  let relatedProducts: Product[] = [];
  if (product.category_id) {
    relatedProducts = await getRelatedProducts(product.category_id, product.id);
  }

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const inStock = product.stock > 0;

  const categoryMap: Record<number, string> = {};
  const categories = await queryAll<{ id: number; name: string }>("SELECT id, name FROM categories");
  categories.forEach((c) => {
    categoryMap[c.id] = c.name;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container-max mx-auto px-4 lg:px-12 pt-24 pb-12 w-full">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-on-surface-variant">
            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/catalogo" className="hover:text-primary">Catálogo</Link></li>
            {product.category_name && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/catalogo/${product.category_slug}`} className="hover:text-primary">
                    {product.category_name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-on-surface font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bento-tile aspect-square overflow-hidden bg-surface-container-low flex items-center justify-center p-8">
            <Image
              src={product.image_url || "/placeholder.jpg"}
              alt={product.name}
              width={600}
              height={600}
              className="object-contain max-w-full max-h-full"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-label-caps font-label-caps inline-block w-fit mb-4">
                OFERTA
              </span>
            )}
            <h1 className="text-headline-md font-bold text-on-surface">{product.name}</h1>

            {product.short_description && (
              <p className="text-body-lg text-on-surface-variant mt-2">{product.short_description}</p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-headline-md font-bold text-on-surface">
                    ${product.sale_price!.toFixed(2)}
                  </span>
                  <span className="text-body-lg text-on-surface-variant line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-headline-md font-bold text-on-surface">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {product.sku && (
              <p className="mt-2 text-body-md text-on-surface-variant">SKU: {product.sku}</p>
            )}

            <div className="mt-6 flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-body-md text-green-600 font-medium">En stock ({product.stock})</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-error" />
                  <span className="text-body-md text-error font-medium">Agotado</span>
                </>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <ContactButton
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                productPrice={product.sale_price ?? product.price}
                sku={product.sku}
                inStock={inStock}
              />
              <YapeButton
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                productPrice={product.sale_price ?? product.price}
                inStock={inStock}
              />
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-bento-sm p-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-label-caps text-on-surface-variant">Entrega rápida</span>
              </div>
              <div className="bg-surface-container rounded-bento-sm p-4 flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-label-caps text-on-surface-variant">Envío gratis</span>
              </div>
            </div>

            {product.description && (
              <div className="mt-8 border-t border-outline-variant pt-8">
                <h2 className="text-headline-sm font-bold text-on-surface mb-3">Descripción</h2>
                <p className="text-body-md text-on-surface-variant whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} categoryLabel={p.category_id ? categoryMap[p.category_id] : undefined} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
