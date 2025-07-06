import { categories } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CategoryCard from "@/components/category-card";
import SearchBar from "@/components/search-bar";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Superopi</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = "/api/logout"}
          className="text-gray-500"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      {user && (
        <div className="text-sm text-gray-600">
          Bienvenido, {(user as any).firstName || (user as any).email}
        </div>
      )}
      
      <SearchBar />
      <h2 className="text-xl font-semibold">Categorías</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}