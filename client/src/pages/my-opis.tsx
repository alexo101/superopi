import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, Calendar, Star } from "lucide-react";
import { type Product } from "@shared/schema";

export default function MyOpis() {
  const { user } = useAuth();
  
  const { data: myProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/my-products"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📝 Mis Opis</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Inicia sesión para ver tus contribuciones</p>
            <p className="text-sm text-gray-500">
              Aquí podrás ver todos los productos que has subido a la plataforma
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📝 Mis Opis</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📝 Mis Opis</h1>
        <Badge variant="secondary" className="text-sm">
          {myProducts?.length || 0} contribucion{(myProducts?.length || 0) !== 1 ? 'es' : ''}
        </Badge>
      </div>
      
      {myProducts && myProducts.length > 0 ? (
        <div className="space-y-4">
          {myProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600">{product.brand}</p>
                        <p className="text-sm text-gray-500">{product.supermarket}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{product.rating}/10</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">
                        Dulzor: {product.sweetness}/10
                      </Badge>
                      <Badge variant="outline">
                        Salinidad: {product.saltiness}/10
                      </Badge>
                      <Badge variant="outline">
                        Olor: {product.smell}/10
                      </Badge>
                      <Badge variant="outline">
                        Eficacia: {product.effectiveness}/10
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Aún no has subido ningún producto</p>
            <p className="text-sm text-gray-500 mb-4">
              ¡Empieza a contribuir subiendo tu primer producto!
            </p>
            <Badge variant="secondary" className="text-xs">
              0 contribuciones
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}