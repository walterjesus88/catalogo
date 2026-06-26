import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant mt-12">
      <div className="w-full py-8 px-4 lg:px-12 flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto">
        <div className="flex flex-col mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="text-headline-sm text-on-surface">Catálogo Digital</span>
          </div>
          <span className="text-body-md text-on-secondary-fixed-variant">
            © {new Date().getFullYear()} Catálogo Digital. Sistema de catálogo online.
          </span>
        </div>
        <div className="flex gap-8">
          <Link href="/catalogo" className="text-label-caps text-on-secondary-fixed-variant hover:text-primary transition-opacity underline underline-offset-4">
            Catálogo
          </Link>
          <Link href="/vender" className="text-label-caps text-on-secondary-fixed-variant hover:text-primary transition-opacity underline underline-offset-4">
            ¿Tu catálogo?
          </Link>
          <Link href="/admin" className="text-label-caps text-on-secondary-fixed-variant hover:text-primary transition-opacity underline underline-offset-4">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
