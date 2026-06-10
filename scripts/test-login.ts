import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  const str = String(val);
  return `'${str.replace(/'/g, "''")}'`;
}

function buildSQL(sql: string, params: unknown[]): string {
  let i = 0;
  return sql.replace(/\?/g, () => escapeSQL(params[i++]));
}

(async () => {
  // Simulate the full login flow
  const email = "admin@catalogo.local";
  const password = "admin123";

  // Step 1: query the user
  const sql = buildSQL("SELECT * FROM users WHERE email = ?", [email]);
  console.log("SQL:", sql);

  const { data: user, error } = await sb.rpc("query_one", { sql });
  console.log("User found:", !!user);
  console.log("Error:", error);

  if (user) {
    const u = user as any;
    // Step 2: Verify password
    const isValid = await bcrypt.compare(password, u.password_hash);
    console.log("Password valid:", isValid);
    console.log("Hash from DB:", u.password_hash);
  }
})();
