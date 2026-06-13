import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileNav from "@/components/AdminMobileNav";
import Link from "next/link";
import { Store } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-container text-on-primary-container text-center py-2 px-4 text-label-caps font-label-caps">
        ⚡ Demo — ¿Quieres tu propio catálogo? Escríbeme al{" "}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "51999999999"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold"
        >
          WhatsApp
        </a>
      </div>
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-bright">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <Store className="h-5 w-5" />
          Catálogo Digital
        </Link>
      </div>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 pb-20 sm:pb-8">{children}</main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
