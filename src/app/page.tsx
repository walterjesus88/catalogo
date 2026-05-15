import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { queryAll, queryOne, initDb } from "@/lib/db";
import Link from "next/link";
import { Zap, Truck, Cpu, Smartphone, Laptop, Plug } from "lucide-react";

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
  description: string | null;
}

const categoryIcons: Record<string, typeof Smartphone> = {
  smartphones: Smartphone,
  laptops: Laptop,
  accesorios: Plug,
  componentes: Cpu,
};

async function getFeaturedProducts(): Promise<Product[]> {
  await initDb();
  return await queryAll<Product>(
    "SELECT * FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY created_at DESC"
  );
}

async function getNovedades(): Promise<Product[]> {
  await initDb();
  return await queryAll<Product>(
    "SELECT * FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY created_at DESC LIMIT 6"
  );
}

async function getCategories(): Promise<Category[]> {
  return queryAll<Category>("SELECT * FROM categories ORDER BY name");
}

async function getProductCount(): Promise<{ count: number }> {
  await initDb();
  return await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM products WHERE is_active = 1") || { count: 0 };
}

export default async function HomePage() {
  const [featuredProducts, categories, productCount, novedades] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getProductCount(),
    getNovedades(),
  ]);

  const categoryMap: Record<number, string> = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c.name;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Bento Header */}
        <section className="max-w-container-max mx-auto px-4 lg:px-12 py-8">
          <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Main Hero Tile */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-bento p-10 flex flex-col justify-center min-h-[360px] overflow-hidden relative border border-outline-variant">
              <div className="relative z-10 max-w-lg">
                <span className="bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full text-label-caps font-label-caps inline-block mb-6">
                  Nuevo Catálogo
                </span>
                <h1 className="text-display-lg lg:text-5xl text-on-surface mb-6">
                  Tecnología al mejor precio
                </h1>
                <p className="text-body-lg text-on-surface-variant mb-8">
                  Descubre nuestra selección de smartphones, laptops y accesorios de computación con los mejores precios del mercado.
                </p>
                <Link
                  href="/catalogo"
                  className="bg-primary-container text-on-primary-container px-8 py-4 rounded-bento-sm font-bold text-body-md hover:bg-primary hover:text-on-primary transition-all inline-block"
                >
                  Explorar Catálogo
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />
            </div>

            {/* Side Tiles */}
            <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-primary rounded-bento p-8 text-on-primary flex flex-col justify-between">
                <Zap className="h-10 w-10 mb-4" />
                <div>
                  <h3 className="text-headline-sm mb-2">Ofertas Exclusivas</h3>
                  <p className="text-body-md opacity-90">Hasta 30% de descuento en productos seleccionados.</p>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-bento p-8 flex flex-col justify-between border border-outline-variant">
                <Truck className="h-10 w-10 text-primary mb-4" />
                <div>
                  <h3 className="text-headline-sm text-on-surface mb-2">Envío Rápido</h3>
                  <p className="text-body-md text-on-surface-variant">Entrega en 24-48hs en productos destacados.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Bento Grid */}
          <div className="mb-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">Categorías</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || Smartphone;
                return (
                  <Link
                    key={category.id}
                    href={`/catalogo/${category.slug}`}
                    className="bento-tile p-6 text-center hover:border-primary/50 transition-colors group"
                  >
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mt-1 text-sm">{category.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Novedades 3D Section */}
          {novedades.length >= 2 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-500 text-white p-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </span>
                  <h2 className="text-headline-md font-bold text-on-surface">Novedades 3D</h2>
                </div>
                <Link href="/catalogo" className="text-label-caps font-label-caps text-primary hover:underline">
                  Explorar →
                </Link>
              </div>
              <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex gap-6 min-w-max">
                  {novedades.map((product, i) => (
                    <Link
                      key={product.id}
                      href={`/producto/${product.slug}`}
                      className="group flex-shrink-0 w-64 snap-center"
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      <div className="relative transition-all duration-500 ease-out"
                           style={{
                             transform: `rotateY(${(i - (novedades.length - 1) / 2) * 4}deg) scale(${1 - Math.abs(i - (novedades.length - 1) / 2) * 0.02})`,
                             transformStyle: 'preserve-3d',
                           }}>
                        <div className="group-hover:scale-[1.02] group-hover:rotateY-0 transition-all duration-300">
                          <ProductCard
                            product={{
                              ...product,
                              short_description: product.short_description || null,
                            }}
                            categoryLabel={product.category_id ? categoryMap[product.category_id] : undefined}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
              `}</style>
            </div>
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline-md font-bold text-on-surface">Productos Destacados</h2>
                <Link href="/catalogo" className="text-label-caps font-label-caps text-primary hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryLabel={product.category_id ? categoryMap[product.category_id] : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stats Mini-Dashboard */}
          <div className="mt-12 bg-surface-container rounded-bento p-8 border border-outline-variant/30">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">CATÁLOGO</p>
                <h2 className="text-headline-sm text-primary">{productCount.count} Productos Disponibles</h2>
              </div>
              <Cpu className="h-10 w-10 text-primary" />
            </div>
            <div className="flex items-end justify-between">
              <div className="flex gap-2">
                <div className="h-10 w-2 bg-primary rounded-full"></div>
                <div className="h-10 w-2 bg-primary rounded-full"></div>
                <div className="h-10 w-2 bg-primary rounded-full"></div>
                <div className="h-10 w-2 bg-primary/20 rounded-full"></div>
              </div>
              <p className="text-body-md text-on-surface-variant">{categories.length} Categorías</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
