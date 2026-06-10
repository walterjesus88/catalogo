import { createClient } from "@supabase/supabase-js";
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

(async () => {
  // Test query_all
  const { data: all, error: err1 } = await sb.rpc("query_all", {
    sql: "SELECT * FROM users",
  });
  console.log("=== query_all ===");
  console.log("data:", JSON.stringify(all, null, 2));
  console.log("error:", JSON.stringify(err1));

  // Test query_one
  const { data: one, error: err2 } = await sb.rpc("query_one", {
    sql: "SELECT * FROM users WHERE email = 'admin@catalogo.local'",
  });
  console.log("\n=== query_one ===");
  console.log("data:", JSON.stringify(one, null, 2));
  console.log("error:", JSON.stringify(err2));

  // Test what buildSQL produces
  const email = "admin@catalogo.local";
  const escaped = `'${String(email).replace(/'/g, "''")}'`;
  const sql = `SELECT * FROM users WHERE email = ${escaped}`;
  console.log("\n=== buildSQL simulation ===");
  console.log("sql:", sql);

  const { data: direct, error: err3 } = await sb.rpc("query_one", { sql });
  console.log("data:", JSON.stringify(direct, null, 2));
  console.log("error:", JSON.stringify(err3));
})();
