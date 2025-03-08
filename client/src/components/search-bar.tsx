import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "./product-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/search", query],
    enabled: query.length > 0,
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {query.length > 0 && (
        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : products?.length ? (
            <ProductGrid products={products} />
          ) : (
            <p className="text-center text-muted-foreground">
              No se encontraron productos
            </p>
          )}
        </div>
      )}
    </div>
  );
}
