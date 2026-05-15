import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "catalogo.db");

function getDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function initDb(): void {
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
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      sale_price DECIMAL(10, 2),
      sku TEXT UNIQUE,
      stock INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER REFERENCES categories(id),
      image_url TEXT,
      images TEXT,
      is_featured BOOLEAN NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT 1,
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
      amount DECIMAL(10, 2) NOT NULL,
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

export function runQuery<T>(sql: string, params: unknown[] = []): T {
  const db = getDb();
  const result = db.prepare(sql).run(...params);
  db.close();
  return result as T;
}

export function transaction<T>(fn: (db: Database.Database) => T): T {
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

export function queryOne<T>(sql: string, params: unknown[] = []): T | null {
  const db = getDb();
  const result = db.prepare(sql).get(...params);
  db.close();
  return (result as T) || null;
}

export function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  const db = getDb();
  const result = db.prepare(sql).all(...params);
  db.close();
  return result as T[];
}
