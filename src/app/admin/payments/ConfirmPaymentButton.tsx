"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ConfirmPaymentButton({ paymentId }: { paymentId: number }) {
  const router = useRouter();

  async function handleConfirm() {
    if (!confirm("¿Confirmar pago? Se descontará 1 unidad del stock.")) return;

    try {
      const res = await fetch(`/api/payment/${paymentId}`, { method: "PATCH" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al confirmar");
        return;
      }

      router.refresh();
    } catch {
      alert("Error de conexión");
    }
  }

  return (
    <button
      onClick={handleConfirm}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-primary hover:text-white transition-all"
    >
      <CheckCircle className="h-3.5 w-3.5" />
      Confirmar
    </button>
  );
}
