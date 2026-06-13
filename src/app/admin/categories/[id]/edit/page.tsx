import { notFound } from "next/navigation";
import { queryOne, initDb } from "@/lib/db";
import CategoryForm from "@/components/CategoryForm";

export const dynamic = "force-dynamic";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  await initDb();

  const category = await queryOne<Category>("SELECT * FROM categories WHERE id = ?", [params.id]);
  if (!category) notFound();

  const initialData = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image_url: category.image_url || "",
  };

  return (
    <div>
      <h1 className="text-lg sm:text-headline-md font-bold text-on-surface mb-6 sm:mb-8">
        Editar Categoría
      </h1>
      <div className="bento-tile p-6">
        <CategoryForm initialData={initialData} />
      </div>
    </div>
  );
}
