import { Pool } from "pg";
import fs from "fs";
import path from "path";

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

const REF = "mzkexbwertxhbwsxdluo";
const PASS = process.env.DATABASE_PASSWORD || "";
const pool = new Pool({
  connectionString: `postgresql://postgres:${PASS}@db.${REF}.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const c = await pool.connect();
  const r = await c.query(
    "SELECT proname, prosrc FROM pg_proc WHERE proname IN ('query_all','query_one','exec_sql') ORDER BY proname"
  );
  for (const row of r.rows) {
    console.log("=== " + row.proname + " ===");
    console.log(row.prosrc.substring(0, 300));
    console.log("---");
  }
  c.release();
  await pool.end();
})();
