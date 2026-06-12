import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

function getStorageClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

const BUCKET = "products";

export async function ensureBucket(): Promise<void> {
  const sb = getStorageClient();
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await sb.storage.createBucket(BUCKET, { public: true });
  }
}

export async function uploadImage(
  file: File,
  folder = "general"
): Promise<string> {
  const sb = getStorageClient();
  await ensureBucket();

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await sb.storage.from(BUCKET).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(filename);
  return publicUrl.publicUrl;
}
