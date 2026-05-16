import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Load .env.local manually (dotenv)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const PASS = process.env.DATABASE_PASSWORD || "";
console.log("Password loaded:", PASS ? "yes" : "no");

const REF = "mzkexbwertxhbwsxdluo";
const HOST = `db.${REF}.supabase.co`;

async function main() {
  const pool = new Pool({
    connectionString: `postgresql://postgres:${PASS}@${HOST}:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  });

  const sql = fs.readFileSync(
    path.join(process.cwd(), "supabase-migration.sql"),
    "utf8"
  );

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Migration applied successfully");
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
