import Database from "better-sqlite3";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const DB_PATH = path.join(process.cwd(), "data", "catalogo.db");

const USE_PG = !!process.env.SUPABASE_URL;

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "bigint") return String(val);
  const str = String(val);
  return `'${str.replace(/'/g, "''")}'`;
}

function buildSQL(sql: string, params: unknown[]): string {
  let i = 0;
  return sql.replace(/\?/g, () => escapeSQL(params[i++]));
}

async function callRpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const sb = getSupabase();
  const { data, error } = await (sb.rpc as any)(name, args);
  if (error) throw new Error(error.message);
  return data as T;
}

async function rpcQueryAll<T>(sql: string, params: unknown[]): Promise<T[]> {
  const data = await callRpc<unknown[]>("query_all", { sql: buildSQL(sql, params) });
  return (data || []) as T[];
}

async function rpcQueryOne<T>(sql: string, params: unknown[]): Promise<T | null> {
  const data = await callRpc<unknown>("query_one", { sql: buildSQL(sql, params) });
  return (data || null) as T | null;
}

async function rpcRunQuery<T>(sql: string, params: unknown[]): Promise<T> {
  const data = await callRpc<T>("exec_sql", { sql: buildSQL(sql, params) });
  return data;
}

function normalizeSql(sql: string): string {
  let i = 0;
  return sql
    .replace(/\?/g, () => `$${++i}`)
    .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, "TIMESTAMPTZ DEFAULT NOW()")
    .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, "BIGSERIAL PRIMARY KEY")
    .replace(/ INTEGER REFERENCES /g, " BIGINT REFERENCES ")
    .replace(/AUTOINCREMENT/g, "");
}

function getDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export async function initDb(): Promise<void> {
  if (USE_PG) {
    // Tables already created by supabase-migration.sql
    return;
  }
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, image_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, short_description TEXT, price DECIMAL(10,2) NOT NULL DEFAULT 0, sale_price DECIMAL(10,2), sku TEXT UNIQUE, stock INTEGER NOT NULL DEFAULT 0, category_id INTEGER REFERENCES categories(id), image_url TEXT, images TEXT, is_featured SMALLINT NOT NULL DEFAULT 0, is_active SMALLINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS contact_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER REFERENCES products(id), product_name TEXT NOT NULL, phone TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS payment_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER REFERENCES products(id), product_name TEXT NOT NULL, amount DECIMAL(10,2) NOT NULL, method TEXT NOT NULL DEFAULT 'yape', status TEXT NOT NULL DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `);
  db.close();
}

export async function runQuery<T>(sql: string, params: unknown[] = []): Promise<T> {
  if (USE_PG) return rpcRunQuery<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).run(...params);
  db.close();
  return result as T;
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  if (USE_PG) return rpcQueryOne<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).get(...params);
  db.close();
  return (result as T) || null;
}

export async function queryAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (USE_PG) return rpcQueryAll<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).all(...params);
  db.close();
  return result as T[];
}
