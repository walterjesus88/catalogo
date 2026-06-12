"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { Camera, Package, Plus } from "lucide-react";

interface ScannedProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number | null;
}

export default function ScanPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedSku, setScannedSku] = useState("");
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!scanning || !containerRef.current) return;

    let cancelled = false;
    const elId = "scanner-container-inner";

    const startCam = async () => {
      try {
        const scanner = new Html5Qrcode(elId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 280, height: 150 } },
          async (decodedText) => {
            if (cancelled) return;
            await scanner.stop();
            scannerRef.current = null;
            setScanning(false);
            setScannedSku(decodedText);
            lookupProduct(decodedText);
          },
          () => {}
        );
      } catch {
        if (!cancelled) {
          setScanning(false);
          setCameraError("No se pudo acceder a la cámara. Asegúrate de permitir el acceso.");
        }
      }
    };

    startCam();

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const startScanning = () => {
    setCameraError("");
    setProduct(null);
    setNotFound(false);
    setScannedSku("");
    setMessage("");
    setScanning(true);
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const lookupProduct = async (sku: string) => {
    try {
      const res = await fetch(`/api/products/lookup?sku=${encodeURIComponent(sku)}`);
      const data = await res.json();
      if (data.found) {
        setProduct(data.product);
        setStockUpdate(data.product.stock);
      } else {
        setNotFound(true);
      }
    } catch {
      setMessage("Error al buscar el producto");
    }
  };

  const updateStock = async () => {
    if (!product) return;
    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: stockUpdate }),
      });

      if (res.ok) {
        setMessage(`Stock actualizado: ${stockUpdate} unidades`);
        setProduct({ ...product, stock: stockUpdate });
      } else {
        setMessage("Error al actualizar stock");
      }
    } catch {
      setMessage("Error de conexión");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg sm:text-headline-md font-bold text-on-surface mb-6 sm:mb-8">Escanear código</h1>

      <div className="bento-tile p-6">
        {!scanning && !scannedSku && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-body-lg text-on-surface-variant mb-6">
              Escanea el código de barras de un producto para consultar o actualizar su stock
            </p>
            {cameraError && (
              <p className="text-error text-body-md mb-4">{cameraError}</p>
            )}
            <button onClick={startScanning} className="btn-bento w-auto px-8 py-4 inline-flex items-center gap-3 text-lg">
              <Camera className="h-6 w-6" />
              Iniciar escáner
            </button>
          </div>
        )}

        {scanning && (
          <div ref={containerRef}>
            <div id="scanner-container-inner" className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-black" style={{ minHeight: 300 }} />
            <div className="text-center mt-4">
              <button onClick={stopScanning} className="text-error hover:underline text-body-md">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {scannedSku && !product && !notFound && (
          <div className="text-center py-8">
            <p className="text-body-lg text-on-surface-variant">Buscando SKU: <strong>{scannedSku}</strong>...</p>
          </div>
        )}

        {product && (
          <div className="max-w-md mx-auto">
            <div className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-label-caps font-label-caps inline-block mb-2">Producto encontrado</div>
            <h2 className="text-headline-sm font-bold text-on-surface mb-4">{product.name}</h2>

            <div className="bg-surface-container rounded-bento p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">SKU</span>
                <span className="text-on-surface font-mono">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Precio</span>
                <span className="text-on-surface">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Stock actual</span>
                <span className={`font-semibold ${product.stock <= 5 ? "text-error" : "text-on-surface"}`}>
                  {product.stock} unid.
                </span>
              </div>
            </div>

            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Nuevo stock</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
                min={0}
                className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
              />
              <button
                onClick={updateStock}
                disabled={updating}
                className="btn-bento w-auto px-6 py-3"
              >
                {updating ? "Guardando..." : "Actualizar"}
              </button>
            </div>

            {message && (
              <p className={`mt-3 text-body-md ${message.includes("Error") ? "text-error" : "text-green-600"}`}>
                {message}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Link href={`/admin/products/${product.id}/edit`} className="btn-bento-outline flex items-center gap-2 px-4 py-3">
                <Package className="h-4 w-4" />
                Editar producto
              </Link>
              <button onClick={startScanning} className="btn-bento-outline flex items-center gap-2 px-4 py-3">
                <Camera className="h-4 w-4" />
                Escanear otro
              </button>
            </div>
          </div>
        )}

        {notFound && (
          <div className="text-center py-8 max-w-md mx-auto">
            <div className="bg-error-container text-error px-3 py-1 rounded-full text-label-caps font-label-caps inline-block mb-4">No encontrado</div>
            <p className="text-body-lg text-on-surface-variant mb-2">
              No existe un producto con el código <strong>{scannedSku}</strong>
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Link
                href={`/admin/products/new?sku=${encodeURIComponent(scannedSku)}`}
                className="btn-bento flex items-center gap-2 px-6 py-3"
              >
                <Plus className="h-4 w-4" />
                Crear producto
              </Link>
              <button onClick={startScanning} className="btn-bento-outline flex items-center gap-2 px-6 py-3">
                <Camera className="h-4 w-4" />
                Escanear otro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
