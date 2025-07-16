import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertProductSchema, supermarkets, categories, Product } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductMatcher from "@/components/product-matcher";

export default function Upload() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [supermarketSearch, setSupermarketSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      rating: 0,
      categoryId: 1,
      supermarket: "",
      imageUrl: "",
      sweetness: 0,
      saltiness: 0,
      smell: 0,
      effectiveness: 0,
      price: 0,
    },
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdatingExisting(true);
    
    // Auto-populate fields
    form.setValue("name", product.name);
    form.setValue("brand", product.brand);
    form.setValue("categoryId", product.categoryId);
    form.setValue("imageUrl", product.imageUrl);
    
    // Clear fields that user needs to fill
    form.setValue("supermarket", "");
    form.setValue("price", 0);
    form.setValue("rating", 0);
    form.setValue("sweetness", 0);
    form.setValue("saltiness", 0);
    form.setValue("smell", 0);
    form.setValue("effectiveness", 0);
    
    setSearchTerm("");
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isUpdatingExisting && selectedProduct) {
        // Update existing product rating
        const ratingData = {
          rating: data.rating,
          sweetness: data.sweetness,
          saltiness: data.saltiness,
          smell: data.smell,
          effectiveness: data.effectiveness,
        };
        const res = await apiRequest("POST", `/api/products/${selectedProduct.id}/rate`, ratingData);
        return res.json();
      } else {
        // Create new product
        if (!selectedFile) {
          throw new Error("Por favor, selecciona una imagen");
        }

        // First, upload the image
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Error al subir la imagen");
        }

        const { imageUrl } = await uploadRes.json();

        // Then, create the product with the image URL
        const productData = {
          ...data,
          imageUrl,
        };
        const res = await apiRequest("POST", "/api/products", productData);
        return res.json();
      }
    },
    onSuccess: (data) => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/category"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/match"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending"] });
      
      toast({
        title: isUpdatingExisting ? "¡Opinión añadida!" : "¡Producto subido!",
        description: isUpdatingExisting 
          ? "Tu opinión ha sido añadida y promediada con las existentes."
          : "Tu producto ha sido añadido exitosamente.",
      });
      
      // Reset form
      form.reset();
      setSelectedFile(null);
      setSelectedProduct(null);
      setIsUpdatingExisting(false);
      setSearchTerm("");
      
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error al subir el producto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredSupermarkets = supermarkets.filter(s => 
    s.toLowerCase().includes(supermarketSearch.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dame tu Opi</h1>
      
      {!isUpdatingExisting && (
        <ProductMatcher
          onProductSelect={handleProductSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
      
      {isUpdatingExisting && selectedProduct && (
        <div className="border rounded-lg p-4 bg-primary/5">
          <h3 className="font-semibold mb-2">Producto seleccionado:</h3>
          <div className="flex items-center gap-3">
            <img 
              src={selectedProduct.imageUrl} 
              alt={selectedProduct.name} 
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => {
              setIsUpdatingExisting(false);
              setSelectedProduct(null);
              form.reset();
            }}
          >
            Cambiar producto
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => {
          console.log("Form data:", data);
          console.log("Form errors:", form.formState.errors);
          mutation.mutate(data);
        })} className="space-y-4">
          
          {!isUpdatingExisting && (
            <>
              <div>
                <Input placeholder="Nombre del producto" {...form.register("name")} />
              </div>
              <div>
                <Input placeholder="Marca" {...form.register("brand")} />
              </div>
            </>
          )}
          <div>
            <Select
              value={form.watch("supermarket")}
              onValueChange={(value) => form.setValue("supermarket", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Súper donde lo has comprado" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Buscar supermercado..."
                    value={supermarketSearch}
                    onChange={(e) => setSupermarketSearch(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredSupermarkets.map((supermarket) => (
                    <SelectItem key={supermarket} value={supermarket}>
                      {supermarket}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          {!isUpdatingExisting && (
            <div>
              <Select
                value={form.watch("categoryId").toString()}
                onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Input 
              placeholder="Precio (€)" 
              type="number" 
              step="0.01"
              {...form.register("price", { valueAsNumber: true })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valoración de calidad (0-10)</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[form.watch("rating")]}
                    onValueChange={([value]) => form.setValue("rating", value)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Valoración: {form.watch("rating")}/10</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Show sweetness for Alimentación (1) and Bebidas (2) */}
          {(form.watch("categoryId") === 1 || form.watch("categoryId") === 2) && (
            <div>
              <label className="block text-sm font-medium mb-2">Nivel de dulzor (0-10)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[form.watch("sweetness")]}
                      onValueChange={([value]) => form.setValue("sweetness", value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{form.watch("sweetness") <= 3 ? "Poco dulce" : form.watch("sweetness") >= 8 ? "Muy dulce" : "Dulzor medio"} ({form.watch("sweetness")}/10)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {/* Show saltiness only for Alimentación (1) */}
          {form.watch("categoryId") === 1 && (
            <div>
              <label className="block text-sm font-medium mb-2">Nivel de salinidad (0-10)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[form.watch("saltiness")]}
                      onValueChange={([value]) => form.setValue("saltiness", value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{form.watch("saltiness") <= 3 ? "Poco salado" : form.watch("saltiness") >= 8 ? "Muy salado" : "Salinidad media"} ({form.watch("saltiness")}/10)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {/* Show smell for Higiene Personal (3) and Limpieza del hogar (4) */}
          {(form.watch("categoryId") === 3 || form.watch("categoryId") === 4) && (
            <div>
              <label className="block text-sm font-medium mb-2">Olor (0-10)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[form.watch("smell")]}
                      onValueChange={([value]) => form.setValue("smell", value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{form.watch("smell") <= 3 ? "Olor suave" : form.watch("smell") >= 8 ? "Olor fuerte" : "Olor medio"} ({form.watch("smell")}/10)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {/* Show effectiveness only for Limpieza del hogar (4) */}
          {form.watch("categoryId") === 4 && (
            <div>
              <label className="block text-sm font-medium mb-2">Efectos (0-10)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[form.watch("effectiveness")]}
                      onValueChange={([value]) => form.setValue("effectiveness", value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{form.watch("effectiveness") <= 3 ? "Poco efectivo" : form.watch("effectiveness") >= 8 ? "Muy efectivo" : "Efectividad media"} ({form.watch("effectiveness")}/10)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {!isUpdatingExisting && (
            <div>
              <label className="block text-sm font-medium mb-2">Subir foto</label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos aceptados: JPG, PNG, GIF
              </p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending 
              ? (isUpdatingExisting ? "Enviando opinión..." : "Subiendo...")
              : (isUpdatingExisting ? "Enviar Opinión" : "Subir Producto")
            }
          </Button>
        </form>
      </Form>
    </div>
  );
}