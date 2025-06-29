import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { categories, type Product } from "@shared/schema";
import ProductGrid from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/search-bar";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id);
  const category = categories.find((c) => c.id === categoryId);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/category", categoryId],
    enabled: !!categoryId && !isNaN(categoryId),
  });

  if (!category || isNaN(categoryId)) {
    return <div>Categoría no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-4xl">{category.icon}</span>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <SearchBar />
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (products as Product[]).length > 0 ? (
        <ProductGrid products={products as Product[]} />
      ) : (
        <p className="text-center text-muted-foreground">
          No hay productos en esta categoría
        </p>
      )}
    </div>
  );
}