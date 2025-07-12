import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, MapPin, Calendar, User, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { categories } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = categories.find(c => c.id === product.categoryId);
  
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden hover:shadow-lg transition-shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Image Section */}
        <div className="space-y-4">
          <AspectRatio ratio={1}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </AspectRatio>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              {category && (
                <Badge variant="secondary" className="text-sm">
                  {category.icon} {category.name}
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              {product.brand}
            </p>
          </div>

          {/* Price and Store */}
          <div className="flex items-center justify-between">
            {product.price && (
              <div className="text-2xl font-bold text-green-600">
                {product.price}€
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{product.supermarket}</span>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-xl font-semibold">{product.rating}/10</span>
              <span className="text-sm text-muted-foreground">Valoración general</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{product.reviewCount || 1} opiniones</span>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-4">
            {product.sweetness > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Dulzor</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${(product.sweetness / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{product.sweetness}/10</span>
                </div>
              </div>
            )}
            
            {product.saltiness > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Salinidad</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(product.saltiness / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{product.saltiness}/10</span>
                </div>
              </div>
            )}
            
            {product.smell > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Olor</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(product.smell / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{product.smell}/10</span>
                </div>
              </div>
            )}
            
            {product.effectiveness > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Efectividad</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(product.effectiveness / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{product.effectiveness}/10</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-ES') : 'Fecha no disponible'}
              </span>
            </div>
            {product.userId && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Contribuidor #{product.userId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}