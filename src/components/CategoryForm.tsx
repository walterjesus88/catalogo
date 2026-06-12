"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

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
                  fd.append("folder", "categories");
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
