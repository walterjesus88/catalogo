-- Estudiante - Supabase Migration
-- Paste this in Supabase Dashboard → SQL Editor → New Query → Run

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  sku TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id BIGINT REFERENCES categories(id),
  image_url TEXT,
  images TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact logs
CREATE TABLE IF NOT EXISTS contact_logs (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment logs
CREATE TABLE IF NOT EXISTS payment_logs (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'yape',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = 1;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = 1;
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);

-- RPC helpers for REST API access (called via supabase.rpc())
CREATE OR REPLACE FUNCTION query_all(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE 'SELECT COALESCE(json_agg(row_to_json(_t_)), ''[]''::jsonb) FROM (' || sql || ') _t_' INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION query_one(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE 'SELECT row_to_json(_t_) FROM (' || sql || ' LIMIT 1) _t_' INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  last_id bigint;
  result jsonb;
  is_insert boolean;
  lower_sql text;
BEGIN
  lower_sql := lower(sql);
  is_insert := lower_sql ~ '^\s*insert';

  IF is_insert AND lower_sql ~ 'returning' THEN
    EXECUTE 'WITH _ins AS (' || sql || ') SELECT json_agg(row_to_json(_ins)) FROM _ins' INTO result;
    RETURN COALESCE(result, '[]'::jsonb);
  END IF;

  EXECUTE sql;
  GET DIAGNOSTICS v_count = ROW_COUNT;

  IF is_insert THEN
    EXECUTE 'SELECT lastval()' INTO last_id;
    RETURN jsonb_build_object('lastInsertRowid', last_id, 'changes', v_count);
  ELSE
    RETURN jsonb_build_object('changes', v_count);
  END IF;
END;
$$;
