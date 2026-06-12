"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  sale_price: string;
  sku: string;
  stock: string;
  category_id: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductFormData & { id?: number };
  isNew?: boolean;
}

export default function ProductForm({ categories, initialData, isNew }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      short_description: "",
      price: "",
      sale_price: "",
      sku: "",
      stock: "0",
      category_id: "",
      image_url: "",
      is_featured: false,
      is_active: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isNew ? "/api/products" : `/api/products/${initialData!.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-error-container p-3 text-sm text-error">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Nombre *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="nombre-del-producto"
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Precio *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Precio de oferta</label>
          <input
            type="number"
            name="sale_price"
            value={form.sale_price}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Categoría</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Imagen</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://... o sube una foto"
              />
            </div>
            <label className="btn-bento-outline w-auto px-6 py-3 cursor-pointer inline-flex items-center gap-2 shrink-0">
              {uploading ? (
                "Subiendo..."
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  Subir foto
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("folder", "products");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (data.url) {
                      setForm((prev) => ({ ...prev, image_url: data.url }));
                    }
                  } catch {
                    setError("Error al subir imagen");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          </div>
          {form.image_url && (
            <div className="mt-3 relative w-40 h-40 rounded-xl overflow-hidden bg-surface-container-highest">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Descripción corta</label>
          <input
            type="text"
            name="short_description"
            value={form.short_description}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-body-md font-medium text-on-surface-variant mb-1">Descripción completa</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-body-md text-on-surface-variant">Destacado</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-body-md text-on-surface-variant">Activo</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-bento-outline w-auto px-6">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-bento w-auto px-8">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
