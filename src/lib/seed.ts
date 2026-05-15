import { initDb, runQuery, queryOne, queryAll } from "./db";
import { hashPassword } from "./auth";

const PRODUCTS = [
  {
    name: "Samsung Galaxy S25 Ultra 256GB",
    slug: "samsung-galaxy-s25-ultra-256gb",
    description: "El smartphone más avanzado de Samsung con chip Snapdragon 8 Elite, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.9 pulgadas, S Pen integrado y Galaxy AI para productividad sin límites.",
    short_description: "Galaxy S25 Ultra con cámara de 200MP y Galaxy AI",
    price: 6499.00,
    sku: "SAM-S25U-256",
    stock: 15,
    category_slug: "smartphones",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop",
  },
  {
    name: "iPhone 16 Pro Max 256GB",
    slug: "iphone-16-pro-max-256gb",
    description: "El iPhone más potente con chip A18 Pro, sistema de cámara Pro de 48MP con zoom óptico 5x, pantalla Super Retina XDR de 6.9 pulgadas y Apple Intelligence.",
    short_description: "iPhone 16 Pro Max con A18 Pro y cámara de 48MP",
    price: 7499.00,
    sku: "APL-IP16PM-256",
    stock: 10,
    category_slug: "smartphones",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
  },
  {
    name: "Xiaomi 15 256GB",
    slug: "xiaomi-15-256gb",
    description: "Potencia y diseño premium con Snapdragon 8 Elite, cámara Leica de 50MP, pantalla AMOLED de 6.36 pulgadas y carga rápida de 90W. Calidad Leica a tu alcance.",
    short_description: "Xiaomi 15 con cámara Leica y Snapdragon 8 Elite",
    price: 3999.00,
    sale_price: 3499.00,
    sku: "XIA-15-256",
    stock: 20,
    category_slug: "smartphones",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
  },
  {
    name: "Samsung Galaxy A55 5G 128GB",
    slug: "samsung-galaxy-a55-5g-128gb",
    description: "El mid-range definitivo de Samsung con procesador Exynos 1480, pantalla Super AMOLED de 6.6 pulgadas, cámara de 50MP y resistencia IP67. Diseño premium en metal y vidrio.",
    short_description: "Galaxy A55 con pantalla AMOLED y resistencia IP67",
    price: 1899.00,
    sale_price: 1599.00,
    sku: "SAM-A55-128",
    stock: 30,
    category_slug: "smartphones",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=600&h=600&fit=crop",
  },
  {
    name: "MacBook Air 15\" M3 256GB",
    slug: "macbook-air-15-m3-256gb",
    description: "Increíblemente delgado y potente con chip M3, pantalla Liquid Retina de 15.3 pulgadas, hasta 18 horas de batería y diseño fanless. Ideal para trabajo y creatividad.",
    short_description: "MacBook Air 15\" con chip M3 y 18h de batería",
    price: 6999.00,
    sku: "MBA-15-M3-256",
    stock: 8,
    category_slug: "laptops",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
  },
  {
    name: "ASUS ROG Strix G16 RTX 4060",
    slug: "asus-rog-strix-g16-rtx-4060",
    description: "Laptop gaming de alto rendimiento con Intel Core i7, RTX 4060, 16GB DDR5 y pantalla de 16\" 165Hz QHD+. Diseñada para gamers exigentes.",
    short_description: "Gaming laptop con RTX 4060 y pantalla 165Hz",
    price: 5499.00,
    sale_price: 4999.00,
    sku: "ASUS-ROG-G16-4060",
    stock: 6,
    category_slug: "laptops",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b4550a6?w=600&h=600&fit=crop",
  },
  {
    name: "Lenovo IdeaPad Slim 5 14\" Ryzen 7",
    slug: "lenovo-ideapad-slim-5-14-ryzen-7",
    description: "Ultrabook elegante y ligero con AMD Ryzen 7 7730U, 16GB RAM, SSD 512GB y pantalla IPS de 14\" Full HD. Perfecto para productividad diaria.",
    short_description: "Ultrabook con Ryzen 7 y pantalla IPS 14\"",
    price: 3299.00,
    sku: "LEN-IPS5-14-R7",
    stock: 12,
    category_slug: "laptops",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
  },
  {
    name: "Cargador Samsung 45W USB-C",
    slug: "cargador-samsung-45w-usb-c",
    description: "Cargador de pared oficial Samsung con tecnología Super Fast Charging 2.0, puerto USB-C y compatibilidad con todos los dispositivos Galaxy y otros smartphones.",
    short_description: "Cargador oficial Samsung 45W Super Fast Charging",
    price: 149.00,
    sale_price: 119.00,
    sku: "SAM-CHG-45W",
    stock: 50,
    category_slug: "accesorios",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
  },
  {
    name: "AirPods Pro 2 con USB-C",
    slug: "airpods-pro-2-usb-c",
    description: "Cancelación activa de ruido adaptativa, audio espacial personalizado, resistencia al agua IP54 y hasta 6 horas de escucha. El estándar en audio premium.",
    short_description: "AirPods Pro 2 con cancelación de ruido adaptativa",
    price: 1299.00,
    sku: "APL-APP2-USBC",
    stock: 25,
    category_slug: "accesorios",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1606841837239-c5a1a4245aa0?w=600&h=600&fit=crop",
  },
  {
    name: "SSD Samsung 990 EVO 1TB NVMe",
    slug: "ssd-samsung-990-evo-1tb-nvme",
    description: "SSD NVMe M.2 de alto rendimiento con velocidades de lectura de hasta 5000 MB/s y escritura de 4200 MB/s. Ideal para gaming y creación de contenido.",
    short_description: "SSD NVMe 1TB con velocidad de 5000 MB/s",
    price: 399.00,
    sale_price: 329.00,
    sku: "SSD-990EVO-1TB",
    stock: 30,
    category_slug: "componentes",
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&h=600&fit=crop",
  },
  {
    name: "Funda Samsung Galaxy S25 Ultra Clear",
    slug: "funda-samsung-galaxy-s25-ultra-clear",
    description: "Funda transparente oficial Samsung con protección militar MIL-STD-810H, compatibilidad con S Pen y diseño ultra delgado que muestra el diseño original.",
    short_description: "Funda transparente oficial con protección militar",
    price: 199.00,
    sku: "SAM-CASE-S25U",
    stock: 40,
    category_slug: "accesorios",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop",
  },
  {
    name: "Memoria RAM Kingston Fury 32GB DDR5",
    slug: "ram-kingston-fury-32gb-ddr5",
    description: "Kit de memoria RAM DDR5 de alto rendimiento, 5600MHz, 2x16GB con disipador de calor. Ideal para trabajo intensivo, gaming y edición de video.",
    short_description: "Kit DDR5 32GB 5600MHz con disipador",
    price: 449.00,
    sku: "RAM-KF-D5-32GB",
    stock: 20,
    category_slug: "componentes",
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&h=600&fit=crop",
  },
];

async function seed() {
  console.log("Initializing database...");
  await initDb();

  const CATEGORIES = [
    { name: "Smartphones", slug: "smartphones", description: "Los últimos modelos de teléfonos inteligentes" },
    { name: "Laptops", slug: "laptops", description: "Computadoras portátiles para trabajo y gaming" },
    { name: "Accesorios", slug: "accesorios", description: "Cables, cargadores, fundas y más" },
    { name: "Componentes", slug: "componentes", description: "RAM, SSD, procesadores y periféricos" },
  ];

  console.log("Seeding categories...");
  for (const cat of CATEGORIES) {
    const existing = await queryOne<{ id: number }>("SELECT id FROM categories WHERE slug = ?", [cat.slug]);
    if (!existing) {
      await runQuery("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)", [cat.name, cat.slug, cat.description]);
      console.log(`  ✓ ${cat.name}`);
    }
  }

  console.log("Seeding products...");
  for (const prod of PRODUCTS) {
    const existing = await queryOne<{ id: number }>("SELECT id FROM products WHERE slug = ?", [prod.slug]);
    if (!existing) {
      const category = await queryOne<{ id: number }>("SELECT id FROM categories WHERE slug = ?", [prod.category_slug]);
      await runQuery(
        `INSERT INTO products (name, slug, description, short_description, price, sale_price, sku, stock, category_id, is_featured, is_active, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          prod.name, prod.slug, prod.description, prod.short_description,
          prod.price, prod.sale_price, prod.sku, prod.stock,
          category?.id || null, prod.is_featured ? 1 : 0, prod.image_url,
        ]
      );
      console.log(`  ✓ ${prod.name}`);
    }
  }

  console.log("Creating admin user...");
  const existingAdmin = await queryOne<{ id: number }>("SELECT id FROM users WHERE email = ?", [process.env.ADMIN_EMAIL || "admin@catalogo.local"]);
  if (!existingAdmin) {
    const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD || "admin123");
    await runQuery("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)", [
      process.env.ADMIN_EMAIL || "admin@catalogo.local", passwordHash, "Administrador", "admin",
    ]);
    console.log("  ✓ Admin user created");
  }

  console.log("\n✅ Database seeded successfully!");
}

seed().catch(console.error);
