"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-bright border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-4 lg:px-12 py-4 max-w-container-max mx-auto">
        <Link href="/" className="text-headline-md font-bold text-primary">
          TechStore
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/catalogo" className="text-label-caps font-label-caps text-primary border-b-2 border-primary pb-1 transition-colors">
            Catálogo
          </Link>
          <Link href="/catalogo/smartphones" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors">
            Smartphones
          </Link>
          <Link href="/catalogo/laptops" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors">
            Laptops
          </Link>
          <Link href="/catalogo/accesorios" className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors">
            Accesorios
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <input
              className="bg-surface-container-low border-none rounded-full px-4 py-2 text-body-md w-64 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50"
              placeholder="Buscar productos..."
              type="text"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
          </div>
          <button className="hover:scale-95 duration-200 transition-transform">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </button>
          <Link href="/admin" className="hover:scale-95 duration-200 transition-transform">
            <User className="h-6 w-6 text-primary" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden hover:scale-95 duration-200 transition-transform"
          >
            {mobileOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-bright border-t border-outline-variant px-4 py-4 flex flex-col gap-4">
          <Link href="/catalogo" onClick={() => setMobileOpen(false)} className="text-label-caps font-label-caps text-primary border-l-2 border-primary pl-3 transition-colors">
            Catálogo
          </Link>
          <Link href="/catalogo/smartphones" onClick={() => setMobileOpen(false)} className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors pl-3">
            Smartphones
          </Link>
          <Link href="/catalogo/laptops" onClick={() => setMobileOpen(false)} className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors pl-3">
            Laptops
          </Link>
          <Link href="/catalogo/accesorios" onClick={() => setMobileOpen(false)} className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors pl-3">
            Accesorios
          </Link>
        </div>
      )}
    </header>
  );
}
