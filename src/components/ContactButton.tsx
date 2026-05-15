"use client";

import { useState } from "react";

interface ContactButtonProps {
  productId: number;
  productName: string;
  productSlug: string;
  productPrice: number;
  sku: string | null;
  inStock: boolean;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "51999999999";

export default function ContactButton({
  productId,
  productName,
  productSlug,
  productPrice,
  sku,
  inStock,
}: ContactButtonProps) {
  const [sending, setSending] = useState(false);

  const handleClick = async () => {
    setSending(true);

    const msg =
`Hola! Me interesa este producto:

*${productName}*
Precio: S/ ${productPrice.toFixed(2)}
SKU: ${sku || "N/A"}
${window.location.origin}/producto/${productSlug}

¿Podrían darme más información?`;

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
        }),
      });
    } catch {
      // Silent fail - log is best-effort
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setSending(false);
  };

  return (
    <button onClick={handleClick} className="btn-bento" disabled={!inStock || sending}>
      {sending ? "Abriendo WhatsApp..." : inStock ? "Consultar por WhatsApp" : "Producto agotado"}
    </button>
  );
}
