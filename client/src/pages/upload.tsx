import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertProductSchema, supermarkets, categories } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      rating: 5,
      categoryId: 1,
      supermarket: "Mercadona",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product uploaded successfully",
        description: "Your product has been added to the catalog",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to upload product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Upload Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <Input placeholder="Product Name" {...form.register("name")} />
          </div>
          <div>
            <Textarea placeholder="Description" {...form.register("description")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quality Rating (0-10)</label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[form.watch("rating")]}
              onValueChange={([value]) => form.setValue("rating", value)}
            />
          </div>
          <div>
            <Select
              value={form.watch("supermarket")}
              onValueChange={(value) => form.setValue("supermarket", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Supermarket" />
              </SelectTrigger>
              <SelectContent>
                {supermarkets.map((supermarket) => (
                  <SelectItem key={supermarket} value={supermarket}>
                    {supermarket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={form.watch("categoryId").toString()}
              onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
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
            <Input placeholder="Image URL" {...form.register("imageUrl")} />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Uploading..." : "Upload Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
