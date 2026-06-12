import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no debe superar 5MB" }, { status: 400 });
    }

    const folder = formData.get("folder") as string || "general";
    const url = await uploadImage(file, folder);

    return NextResponse.json({ url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al subir imagen";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
