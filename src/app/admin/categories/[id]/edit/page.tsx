import { queryOne, initDb } from "@/lib/db";
import CategoryForm from "@/components/CategoryForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  await initDb();
  const category = await queryOne<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
  }>("SELECT * FROM categories WHERE id = ?", [params.id]);

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Editar Categoría</h1>
      <div className="bento-tile p-6">
        <CategoryForm
          initialData={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            image_url: category.image_url || "",
          }}
        />
      </div>
    </div>
  );
}
