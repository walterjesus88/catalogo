import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
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
  try {
    // Step 1: initDb equivalent (no-op for USE_PG)
    console.log("1. initDb... OK (no-op)");

    // Step 2: Simulate request.json()
    const email = "admin@catalogo.local";
    const password = "admin123";
    if (!email || !password) throw new Error("Missing credentials");
    console.log("2. Parsed credentials: OK");

    // Step 3: queryOne
    const sql = buildSQL("SELECT * FROM users WHERE email = ?", [email]);
    console.log("3a. SQL:", sql);

    const { data, error } = await (sb.rpc as any)("query_one", { sql });
    if (error) throw new Error(`RPC error: ${error.message}`);
    const user = data as any;
    if (!user) throw new Error("User not found");
    console.log("3b. User found:", user.email);

    // Step 4: verifyPassword
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error("Password mismatch");
    console.log("4. Password valid: YES");

    // Step 5: createToken
    const SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-me"
    );
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(SECRET);
    console.log("5. Token created:", token.substring(0, 40) + "...");

    console.log("\n✅ All steps OK");
  } catch (e: any) {
    console.error("\n❌ Failed:", e.message);
  }
})();
