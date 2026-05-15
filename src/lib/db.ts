import Database from "better-sqlite3";
import path from "path";
import { Pool } from "pg";

const DB_PATH = path.join(process.cwd(), "data", "catalogo.db");

const USE_PG = !!process.env.SUPABASE_URL;

let pgPool: Pool | null = null;

function getPgPool(): Pool {
  if (!pgPool) {
    const ref = new URL(process.env.SUPABASE_URL!).hostname.split(".")[0];
    pgPool = new Pool({
      connectionString: `postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.${ref}.supabase.co:5432/postgres`,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pgPool;
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

// --- Sync SQLite helpers ---
function getDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

// --- Main exported functions ---

export async function initDb(): Promise<void> {
  if (USE_PG) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS products (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          short_description TEXT,
          price DECIMAL(10,2) NOT NULL DEFAULT 0,
          sale_price DECIMAL(10,2),
          sku TEXT UNIQUE,
          stock INTEGER NOT NULL DEFAULT 0,
          category_id BIGINT REFERENCES categories(id),
          image_url TEXT,
          images TEXT,
          is_featured SMALLINT NOT NULL DEFAULT 0,
          is_active SMALLINT NOT NULL DEFAULT 1,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS contact_logs (
          id BIGSERIAL PRIMARY KEY,
          product_id BIGINT REFERENCES products(id),
          product_name TEXT NOT NULL,
          phone TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS payment_logs (
          id BIGSERIAL PRIMARY KEY,
          product_id BIGINT REFERENCES products(id),
          product_name TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          method TEXT NOT NULL DEFAULT 'yape',
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
    } finally {
      client.release();
    }
  } else {
    const db = getDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        sale_price DECIMAL(10,2),
        sku TEXT UNIQUE,
        stock INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER REFERENCES categories(id),
        image_url TEXT,
        images TEXT,
        is_featured SMALLINT NOT NULL DEFAULT 0,
        is_active SMALLINT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS contact_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER REFERENCES products(id),
        product_name TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS payment_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER REFERENCES products(id),
        product_name TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        method TEXT NOT NULL DEFAULT 'yape',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
      CREATE INDEX IF NOT EXISTS idx_contact_logs_product ON contact_logs(product_id);
      CREATE INDEX IF NOT EXISTS idx_contact_logs_created ON contact_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);
    `);
    db.close();
  }
}

export async function runQuery<T>(sql: string, params: unknown[] = []): Promise<T> {
  if (USE_PG) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      const isInsert = sql.trim().toUpperCase().startsWith("INSERT");
      const query = isInsert ? normalizeSql(sql) + " RETURNING id" : normalizeSql(sql);
      const result = await client.query(query, params);
      if (isInsert) {
        return { lastInsertRowid: result.rows[0]?.id } as T;
      }
      return { changes: result.rowCount } as T;
    } finally {
      client.release();
    }
  } else {
    const db = getDb();
    const result = db.prepare(sql).run(...params);
    db.close();
    return result as T;
  }
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  if (USE_PG) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      const result = await client.query(normalizeSql(sql), params);
      return (result.rows[0] as T) || null;
    } finally {
      client.release();
    }
  } else {
    const db = getDb();
    const result = db.prepare(sql).get(...params);
    db.close();
    return (result as T) || null;
  }
}

export async function queryAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (USE_PG) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      const result = await client.query(normalizeSql(sql), params);
      return result.rows as T[];
    } finally {
      client.release();
    }
  } else {
    const db = getDb();
    const result = db.prepare(sql).all(...params);
    db.close();
    return result as T[];
  }
}

export async function transaction<T>(fn: (db: Database.Database) => T): Promise<T> {
  if (USE_PG) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      try {
        const db = new Database(DB_PATH);
        db.pragma("journal_mode = WAL");
        db.pragma("foreign_keys = ON");
        try {
          const result = await fn(db);
          await client.query("COMMIT");
          return result;
        } finally {
          db.close();
        }
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    } finally {
      client.release();
    }
  } else {
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
}
