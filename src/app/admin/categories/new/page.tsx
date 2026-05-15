import CategoryForm from "@/components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-headline-md font-bold text-on-surface mb-8">Nueva Categoría</h1>
      <div className="bento-tile p-6">
        <CategoryForm isNew />
      </div>
    </div>
  );
}
