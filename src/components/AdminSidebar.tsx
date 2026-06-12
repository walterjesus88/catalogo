import Link from "next/link";
import { LayoutDashboard, Package, FolderOpen, LogOut, Store, MessageSquare, Wallet, Camera } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorías", icon: FolderOpen },
  { href: "/admin/scan", label: "Escanear", icon: Camera },
  { href: "/admin/contacts", label: "Contactos", icon: MessageSquare },
  { href: "/admin/payments", label: "Pagos", icon: Wallet },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r border-outline-variant bg-surface-container-low min-h-screen flex-col">
      <div className="p-6 border-b border-outline-variant">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary hover:text-primary-container transition-colors">
          <Store className="h-5 w-5" />
          TechStore Admin
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-error hover:bg-error-container transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
