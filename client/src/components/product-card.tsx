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
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow mb-4">
      <div className="grid grid-cols-3 gap-3 p-4">
        {/* Image Section - Reduced to 1/3 of card width */}
        <div className="col-span-1">
          <AspectRatio ratio={1}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </AspectRatio>
        </div>

        {/* Product Information - Takes 2/3 of card width */}
        <div className="col-span-2 space-y-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold leading-tight">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {product.brand}
            </p>
          </div>

          {/* Price and Store */}
          <div className="flex items-center justify-between">
            {product.price && (
              <div className="text-lg font-bold text-green-600">
                {product.price}€
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{product.supermarket}</span>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold">{product.rating}/10</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">{product.reviewCount || 1} opiniones</span>
            </div>
          </div>

          {/* Compact Detailed Ratings */}
          <div className="flex flex-wrap gap-2 text-xs">
            {product.sweetness > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-pink-500">🍬</span>
                <span>{product.sweetness}/10</span>
              </div>
            )}
            {product.saltiness > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-blue-500">🧂</span>
                <span>{product.saltiness}/10</span>
              </div>
            )}
            {product.smell > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-purple-500">👃</span>
                <span>{product.smell}/10</span>
              </div>
            )}
            {product.effectiveness > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-green-500">✨</span>
                <span>{product.effectiveness}/10</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}