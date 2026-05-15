"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/catalogo?${params.toString()}`);
  }, [query, router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query || searchParams.get("q")) {
        handleSearch();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch, searchParams]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surface-container-low border-none rounded-full pl-11 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
