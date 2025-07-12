import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductGrid from "@/components/product-grid";
import { Loader2, Flame } from "lucide-react";

export default function Trending() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/trending"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error al cargar los productos trending
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-8 w-8 text-orange-500" />
        <h1 className="text-3xl font-bold">Trending Products</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Los productos más populares ordenados por número de opiniones
      </p>
      
      {products && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Flame className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay productos trending disponibles</p>
        </div>
      )}
    </div>
  );
}