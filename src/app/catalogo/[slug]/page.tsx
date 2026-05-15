import CatalogPage from "../page";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string };
}) {
  return CatalogPage({ searchParams: { ...searchParams, category: params.slug } });
}
