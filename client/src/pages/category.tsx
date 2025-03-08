import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { categories } from "@shared/schema";
import ProductGrid from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id);
  const category = categories.find((c) => c.id === categoryId);

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/category", categoryId],
    enabled: !!categoryId && !isNaN(categoryId),
  });

  if (!category || isNaN(categoryId)) {
    return <div>Category not found</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-4xl">{category.icon}</span>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <ProductGrid products={products || []} />
    </div>
  );
}
