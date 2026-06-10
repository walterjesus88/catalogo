# AGENTS.md

## Goal
- Build a mobile-first online catalog MVP with a public web storefront, admin panel, WhatsApp/Yape payment flow, and a Flutter mobile companion app consuming the same REST API.

## Constraints & Preferences
- Stack: Next.js 14 (monolithic) + SQLite + Tailwind (bento design system)
- Mobile-first responsive design; Flutter mobile app consuming the same REST API
- Admin panel with JWT auth, product/category CRUD, and contact/payment logs
- WhatsApp chat button + Yape payment modal with server-side click logging
- QR code removed: Yape flow uses copy-number + manual amount entry
- Flutter app design should match reference images in `bento/app/` (drew.webp style: green accent #1BA75C, white/clean, bottom nav, search bar top)

## Progress
### Done
- Built full bento design system: purple Material You (#7200C2), Inter font, .bento-tile, .btn-bento, .chip
- SQLite DB with products, categories, users, contact_logs, payment_logs tables
- Seeded 12 products with real Unsplash JPEG images
- Public pages: Home (categories + featured), Catalog (filter chips + search + grid), Product Detail (breadcrumb + WhatsApp + Yape buttons)
- Admin panel: Dashboard (counts), Products/Categories CRUD (table + forms), Contacts stats (total/today/top5), Payments (pending/confirmed)
- Middleware protecting /admin/* (except /login and /api/auth/login) with JWT cookie
- Login: public /login route, API sets cookie via response.cookies.set(), logout via cookies().delete()
- WhatsApp ContactButton: logs click to contact_logs, opens wa.me with formatted product info
- YapePaymentModal: shows amount + copyable phone + steps, logs to payment_logs, opens WhatsApp for voucher
- Android SDK fully installed at C:\android-sdk: platforms 34 + 36, build-tools 36.0.0, platform-tools, licenses all accepted
- Flutter Android toolchain green (flutter doctor ✓ Android SDK version 36.0.0)
- Flutter create --platforms android . run in mobile/ → generated android/ and web/ directories
- Flutter web build succeeded (flutter build web)
- Phone connected via WiFi ADB: adb tcpip 5555 → adb connect 192.168.1.34:5555 (USB cable unstable)
- Flutter app installs and runs on phone via WiFi ADB
- Home screen redesigned: removed hero banner, added categories horizontal scroll + featured grid
- Main shell screen (MainScreen) with AppBar (search field + admin icon), BottomNavigationBar (Inicio, Catálogo, Contacto, Cuenta), and IndexedStack
- Category taps switch to Catalog tab and auto-filter by the tapped category
- Product card layout fixed (FittedBox wrapping price Row)
- Color scheme switched from purple (#7200C2) to green (#1BA75C) per drew.webp reference
- Seed images replaced CDN URLs (PNG/WebP) with Unsplash JPEG URLs for Android compatibility
- Added proper Contacto screen (WhatsApp, Yape, Dirección cards)
- Added proper Cuenta screen (store info, links, version)
- Migrated from pg Pool to Supabase REST API via RPC functions (`query_all`, `query_one`, `exec_sql`)
- Fixed `json_agg` → `jsonb_agg` / `row_to_json` → `to_jsonb` for consistent jsonb types
- Login API confirmed working on Vercel: `POST /api/auth/login` → `{"success":true}` + Set-Cookie
- Diagnostic error detail revealed curl.exe encoding was the cause of earlier "Error interno"
- Flutter `api_config.dart` updated with Vercel prod URL and `useLocal` toggle

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Removed dynamic QR from Yape flow because Yape only reads QR generated from its own app
- Changed WhatsApp message from hardcoded %0A to template literal newlines
- Fixed login cookie bug: cookies().set() does not work in API routes → use response.cookies.set()
- Admin layout no longer wraps login page (separate /login route avoids redirect loop)
- SDK root set to C:\android-sdk via --sdk_root flag when calling sdkmanager
- Moved cmdline-tools into C:\android-sdk\cmdline-tools\latest\ so Flutter can find sdkmanager
- Used WiFi ADB (adb connect) instead of USB due to unstable cable
- Used adb reverse tcp:3000 tcp:3000 for API tunneling over USB (bypasses Windows firewall)
- Home screen hero section removed (user: "esta por demas")
- Category taps switch bottom tab to Catalog instead of pushing a new route; CatalogScreen accepts `initialCategoryId` and auto-filters on initState
- Flutter design follows drew.webp: green accent #1BA75C, white backgrounds, gray (#F5F5F5) cards

## Next Steps
- Test that Unsplash JPEG images decode correctly on Android (open app, check product images)
- Test Yape/WhatsApp flows end-to-end from Flutter app
- Open Windows firewall port 3000 (New-NetFirewallRule) for WiFi API access without adb reverse

## Critical Context
- Project root: C:\Users\Walter\Documents\apps\catalogo
- Dev server: http://localhost:3000 ; network IP 192.168.1.35:3000
- Admin credentials in .env.local: admin@catalogo.local / admin123
- WhatsApp & Yape numbers in .env.local: NEXT_PUBLIC_WHATSAPP, NEXT_PUBLIC_YAPE_PHONE, NEXT_PUBLIC_YAPE_NAME
- Flutter API base URL: mobile\lib\config\api_config.dart → http://192.168.1.35:3000/api
- Phone IP: 192.168.1.34 (same WiFi as PC), ADB connected via WiFi on port 5555
- adb reverse tcp:3000 tcp:3000 active (tunnels API through USB; falls back to WiFi if firewall is open)
- Flutter build output: mobile\build\app\outputs\flutter-apk\app-debug.apk
- Reference images for Flutter design in C:\Users\Walter\Documents\apps\catalogo\bento\app\
- USB cable is unreliable; all ADB operations go through WiFi

## Relevant Files
- src/app/layout.tsx: Root layout with Inter font
- src/app/globals.css: Bento design tokens
- src/app/page.tsx: Home page with categories + featured products
- src/app/catalogo/page.tsx + [slug]/page.tsx: Catalog with filter chips + search
- src/app/producto/[slug]/page.tsx: Product detail with WhatsApp + Yape buttons
- src/app/login/page.tsx: Standalone login page (outside admin layout)
- src/app/admin/*: Admin dashboard, products CRUD, categories, contacts, payments
- src/components/ContactButton.tsx: WhatsApp + log click (Client Component)
- src/components/YapePaymentModal.tsx: Yape modal (copy number + amount + confirm)
- src/lib/seed.ts: DB seed with 12 products using Unsplash JPEG images
- mobile/lib/main.dart: App entry, green theme seed (#1BA75C)
- mobile/lib/screens/main_screen.dart: Shell with AppBar + BottomNav (4 tabs) + IndexedStack
- mobile/lib/screens/home_screen.dart: Home with categories horizontal + featured grid
- mobile/lib/screens/catalog_screen.dart: Catalog with category filters + product grid + search delegate
- mobile/lib/screens/product_detail_screen.dart: Product detail page
- mobile/lib/screens/contact_screen.dart: Contacto screen (WhatsApp, Yape, Dirección cards)
- mobile/lib/screens/cuenta_screen.dart: Cuenta screen (store info, admin link, version)
- mobile/lib/widgets/product_card.dart: Product card with CachedNetworkImage (shimmer + error fallback)
- mobile/lib/widgets/category_chip.dart: Green selected state (#1BA75C), gray unselected
- mobile/lib/config/api_config.dart: baseUrl + whatsapp/yape constants
