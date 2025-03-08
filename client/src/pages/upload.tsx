import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertProductSchema, supermarkets, categories } from "@shared/schema";
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

export default function Upload() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [supermarketSearch, setSupermarketSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      rating: 5,
      categoryId: 1,
      supermarket: "Mercadona",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
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
      const res = await apiRequest("POST", "/api/products", {
        ...data,
        imageUrl,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Producto subido correctamente",
        description: "Tu producto ha sido añadido al catálogo",
      });
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
      <h1 className="text-3xl font-bold">Subir Producto</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <Input placeholder="Nombre del producto" {...form.register("name")} />
          </div>
          <div>
            <Input placeholder="Marca" {...form.register("brand")} />
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
          <div>
            <Select
              value={form.watch("supermarket")}
              onValueChange={(value) => form.setValue("supermarket", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar supermercado" />
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
          <div>
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
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Subiendo..." : "Subir Producto"}
          </Button>
        </form>
      </Form>
    </div>
  );
}