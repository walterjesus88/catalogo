import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { queryAll, queryOne, initDb } from "@/lib/db";
import Link from "next/link";
import { Filter } from "lucide-react";

export const dynamic = "force-dynamic";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  short_description: string | null;
  stock: number;
  category_id: number | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getProducts(categorySlug?: string, searchQuery?: string): Promise<Product[]> {
  initDb();
  let sql = "SELECT * FROM products WHERE is_active = 1";
  const params: unknown[] = [];

  if (categorySlug) {
    sql += " AND category_id = (SELECT id FROM categories WHERE slug = ?)";
    params.push(categorySlug);
  }

  if (searchQuery) {
    sql += " AND (name LIKE ? OR description LIKE ? OR short_description LIKE ?)";
    const likeQuery = `%${searchQuery}%`;
    params.push(likeQuery, likeQuery, likeQuery);
  }

  sql += " ORDER BY created_at DESC";
  return queryAll<Product>(sql, params);
}

async function getCategories(): Promise<Category[]> {
  return queryAll<Category>("SELECT * FROM categories ORDER BY name");
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category, searchParams.q),
    getCategories(),
  ]);

  const currentCategory = searchParams.category
    ? categories.find((c) => c.slug === searchParams.category)
    : null;

  const categoryMap: Record<number, string> = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c.name;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container-max mx-auto px-4 lg:px-12 pt-24 pb-12 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-headline-md font-bold text-on-surface">
            {currentCategory ? currentCategory.name : "Catálogo"}
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""}
            {searchParams.q && ` para "${searchParams.q}"`}
          </p>
        </div>

        {/* Filter/Tabs Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className={`chip transition-colors ${
                !searchParams.category
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className={`chip transition-colors ${
                  searchParams.category === cat.slug
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Filter className="h-5 w-5" />
            <span className="text-label-caps font-label-caps">Filtrar</span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryLabel={product.category_id ? categoryMap[product.category_id] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container rounded-bento">
            <p className="text-headline-sm text-on-surface-variant">No se encontraron productos</p>
            <Link href="/catalogo" className="mt-4 text-primary hover:underline inline-block text-body-md">
              Ver todos los productos
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
