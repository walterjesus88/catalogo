import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Catálogo Digital - Tu tienda online lista en minutos",
  description:
    "Sistema de catálogo digital con panel admin, WhatsApp, Yape, app móvil y escáner de código de barras. Ideal para emprendedores.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Catálogo Digital - Tu tienda online en minutos",
    description:
      "Catálogo web + panel admin + WhatsApp + Yape + app Android",
    type: "website",
    siteName: "Catálogo Digital",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-inter`}>{children}</body>
    </html>
  );
}
