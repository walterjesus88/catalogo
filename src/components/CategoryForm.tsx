"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialData?: { id?: number; name: string; slug: string; description: string; image_url: string };
  isNew?: boolean;
}

export default function CategoryForm({ initialData, isNew }: CategoryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isNew ? "/api/categories" : `/api/categories/${initialData!.id}`;
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

      router.push("/admin/categories");
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

      <div>
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
          placeholder="nombre-categoria"
        />
      </div>

      <div>
        <label className="block text-body-md font-medium text-on-surface-variant mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-body-md font-medium text-on-surface-variant mb-1">URL de imagen</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://..."
        />
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
