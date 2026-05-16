import Database from "better-sqlite3";
import path from "path";
import { Pool } from "pg";

const DB_PATH = path.join(process.cwd(), "data", "catalogo.db");

const USE_PG = !!process.env.SUPABASE_URL;

const PG_CONN_STR = process.env.DATABASE_URL || "";

const PG_HOSTS = PG_CONN_STR
  ? [PG_CONN_STR]
  : [
      `postgresql://postgres:${process.env.DATABASE_PASSWORD || ""}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.mzkexbwertxhbwsxdluo:${process.env.SUPABASE_KEY || ""}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.mzkexbwertxhbwsxdluo:${process.env.DATABASE_PASSWORD || ""}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
    ];

let pgPool: Pool | null = null;
let pgHostIndex = 0;

function resetPgPool(): void {
  if (pgPool) { pgPool.end().catch(() => {}); pgPool = null; }
}

async function withPg<T>(fn: (client: any) => Promise<T>): Promise<T> {
  const startIndex = pgHostIndex;
  for (let attempt = 0; attempt < PG_HOSTS.length; attempt++) {
    const idx = (startIndex + attempt) % PG_HOSTS.length;
    if (!pgPool || pgHostIndex !== idx) {
      resetPgPool();
      pgPool = new Pool({
        connectionString: PG_HOSTS[idx],
        ssl: process.env.DATABASE_NO_SSL ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
        max: 2,
      });
      pgHostIndex = idx;
    }
    try {
      const client = await pgPool.connect();
      try { return await fn(client); } finally { client.release(); }
    } catch (e: any) {
      resetPgPool();
      if (attempt >= PG_HOSTS.length - 1) throw e;
    }
  }
  throw new Error("All database connections failed");
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

async function pgQueryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  return withPg(async (client) => {
    const result = await client.query(normalizeSql(sql), params);
    return (result.rows[0] as T) || null;
  });
}

async function pgQueryAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return withPg(async (client) => {
    const result = await client.query(normalizeSql(sql), params);
    return result.rows as T[];
  });
}

async function pgRunQuery<T>(sql: string, params: unknown[] = []): Promise<T> {
  return withPg(async (client) => {
    const isInsert = sql.trim().toUpperCase().startsWith("INSERT");
    const query = isInsert ? normalizeSql(sql) + " RETURNING id" : normalizeSql(sql);
    const result = await client.query(query, params);
    if (isInsert) return { lastInsertRowid: result.rows[0]?.id } as T;
    return { changes: result.rowCount } as T;
  });
}

export async function initDb(): Promise<void> {
  if (USE_PG) {
    await withPg(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
          description TEXT, image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS products (
          id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
          description TEXT, short_description TEXT,
          price DECIMAL(10,2) NOT NULL DEFAULT 0, sale_price DECIMAL(10,2),
          sku TEXT UNIQUE, stock INTEGER NOT NULL DEFAULT 0,
          category_id BIGINT REFERENCES categories(id),
          image_url TEXT, images TEXT,
          is_featured SMALLINT NOT NULL DEFAULT 0, is_active SMALLINT NOT NULL DEFAULT 1,
          created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
          name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS contact_logs (
          id BIGSERIAL PRIMARY KEY, product_id BIGINT REFERENCES products(id),
          product_name TEXT NOT NULL, phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS payment_logs (
          id BIGSERIAL PRIMARY KEY, product_id BIGINT REFERENCES products(id),
          product_name TEXT NOT NULL, amount DECIMAL(10,2) NOT NULL,
          method TEXT NOT NULL DEFAULT 'yape', status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
    });
  } else {
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
}

export async function runQuery<T>(sql: string, params: unknown[] = []): Promise<T> {
  if (USE_PG) return pgRunQuery<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).run(...params);
  db.close();
  return result as T;
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  if (USE_PG) return pgQueryOne<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).get(...params);
  db.close();
  return (result as T) || null;
}

export async function queryAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (USE_PG) return pgQueryAll<T>(sql, params);
  const db = getDb();
  const result = db.prepare(sql).all(...params);
  db.close();
  return result as T[];
}

export async function transaction<T>(fn: (db: Database.Database) => T): Promise<T> {
  const db = getDb();
  try {
    const result = db.transaction(() => fn(db))();
    db.close();
    return result;
  } catch (error) {
    db.close();
    throw error;
  }
}
