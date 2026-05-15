"use client";

import { useState } from "react";
import { X, CheckCircle, Copy } from "lucide-react";

interface YapePaymentModalProps {
  productId: number;
  productName: string;
  productSlug: string;
  amount: number;
  onClose: () => void;
}

const YAPE_PHONE = process.env.NEXT_PUBLIC_YAPE_PHONE || "51999999999";
const YAPE_NAME = process.env.NEXT_PUBLIC_YAPE_NAME || "Tienda";

export default function YapePaymentModal({
  productId,
  productName,
  productSlug,
  amount,
  onClose,
}: YapePaymentModalProps) {
  const [paid, setPaid] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(YAPE_PHONE);
    } catch {
      const el = document.createElement("input");
      el.value = YAPE_PHONE;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setSending(true);

    try {
      await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, product_name: productName, amount }),
      });
    } catch { /* silent */ }

    const msg = `Hola! Acabo de realizar el pago por Yape:

*${productName}*
Monto: S/ ${amount.toFixed(2)}
${window.location.origin}/producto/${productSlug}

Adjunto comprobante.`;

    window.open(`https://wa.me/${YAPE_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    setPaid(true);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bento-tile bg-surface-container-lowest max-w-md w-full p-8 relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-highest"
        >
          <X className="h-5 w-5" />
        </button>

        {paid ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-headline-sm font-bold text-on-surface mb-2">
              ¡Pago reportado!
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              WhatsApp se abrió con tu comprobante. En breve te confirmamos.
            </p>
            <button onClick={onClose} className="btn-bento">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-headline-sm font-bold text-on-surface mb-2">
              Paga con Yape
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Copiá el número, abrí Yape y pagá <strong>S/ {amount.toFixed(2)}</strong>
            </p>

            <div className="bg-primary-fixed rounded-xl py-6 px-4 mb-6 text-center">
              <p className="text-label-caps text-on-primary-fixed-variant mb-1">Monto</p>
              <p className="text-display-lg font-bold text-primary">
                S/ {amount.toFixed(2)}
              </p>
            </div>

            <div className="bg-surface-container rounded-xl p-4 mb-6">
              <p className="text-label-caps text-on-surface-variant mb-2">Yapear a</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xl font-bold text-on-surface select-all">{YAPE_PHONE}</p>
                  <p className="text-sm text-on-surface-variant">{YAPE_NAME}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-bento-outline w-full sm:w-auto px-5 py-3 flex items-center justify-center gap-2"
                >
                  <Copy className="h-5 w-5" />
                  {copied ? "Copiado" : "Copiar número"}
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={sending}
              className="btn-bento"
            >
              {sending ? "Enviando..." : "Ya pagué — enviar comprobante"}
            </button>

            <p className="text-center text-sm text-on-surface-variant mt-4">
              Al pagar, envianos el voucher por WhatsApp
            </p>
          </>
        )}
      </div>
    </div>
  );
}
