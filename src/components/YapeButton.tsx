"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import YapePaymentModal from "./YapePaymentModal";

interface YapeButtonProps {
  productId: number;
  productName: string;
  productSlug: string;
  productPrice: number;
  inStock: boolean;
}

export default function YapeButton({
  productId,
  productName,
  productSlug,
  productPrice,
  inStock,
}: YapeButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-bento-outline flex items-center justify-center gap-2"
        disabled={!inStock}
      >
        <Wallet className="h-5 w-5" />
        Pagar con Yape
      </button>

      {showModal && (
        <YapePaymentModal
          productId={productId}
          productName={productName}
          productSlug={productSlug}
          amount={productPrice}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
