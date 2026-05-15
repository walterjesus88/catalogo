import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    image_url: string | null;
    short_description: string | null;
    stock: number;
    category_id: number | null;
  };
  categoryLabel?: string;
}

export default function ProductCard({ product, categoryLabel }: ProductCardProps) {
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="bento-tile p-6 flex flex-col">
      <div className="aspect-[4/5] bg-surface-container-low rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-8 relative">
        <Image
          src={product.image_url || "/placeholder.jpg"}
          alt={product.name}
          fill
          className={`object-contain ${product.stock === 0 ? "grayscale opacity-60" : ""}`}
        />
        {product.stock === 0 && (
          <span className="absolute top-4 right-4 bg-error text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Agotado
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Oferta
          </span>
        )}
      </div>

      <div className="flex-1">
        {categoryLabel && (
          <div className="text-label-caps font-label-caps text-primary mb-1">{categoryLabel}</div>
        )}
        <h3 className="text-headline-sm font-headline-sm mb-2 text-on-surface">{product.name}</h3>
        {product.short_description && (
          <p className="text-body-md text-on-surface-variant mb-3 line-clamp-1">{product.short_description}</p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-headline-sm font-headline-sm text-on-surface">
            ${hasDiscount ? product.sale_price!.toFixed(2) : product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-body-md text-on-surface-variant line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <Link href={`/producto/${product.slug}`} className="btn-bento flex items-center justify-center gap-2">
        Lo quiero <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
