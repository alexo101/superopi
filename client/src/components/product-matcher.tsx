import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./product-card";
import { Check, Search } from "lucide-react";

interface ProductMatcherProps {
  onProductSelect: (product: Product) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function ProductMatcher({ onProductSelect, searchTerm, onSearchChange }: ProductMatcherProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: matchedProducts = [], isLoading } = useQuery({
    queryKey: ["/api/products/match", searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/products/match?name=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    enabled: searchTerm.length > 2,
  });

  useEffect(() => {
    if (searchTerm.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
      setSelectedProduct(null);
    }
  }, [searchTerm]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (selectedProduct) {
      onProductSelect(selectedProduct);
      setShowResults(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    onSearchChange("");
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar producto existente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {showResults && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">Productos encontrados:</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Buscando productos...</div>
          ) : matchedProducts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No se encontraron productos. Podrás crear uno nuevo.
            </div>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-1 gap-3">
                  {matchedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`cursor-pointer transition-colors rounded-lg p-2 ${
                        selectedProduct?.id === product.id
                          ? "bg-primary/10 border-2 border-primary"
                          : "hover:bg-background"
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <ProductCard product={product} />
                      {selectedProduct?.id === product.id && (
                        <div className="flex items-center justify-center mt-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="ml-2 text-sm text-primary font-medium">
                            Seleccionado
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleConfirmSelection}
                  disabled={!selectedProduct}
                  className="flex-1"
                >
                  Confirmar selección
                </Button>
                <Button
                  onClick={handleClearSelection}
                  variant="outline"
                  className="flex-1"
                >
                  Crear producto nuevo
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}