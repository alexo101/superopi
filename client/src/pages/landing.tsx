import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Star, Upload, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-red-500">Superopi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La plataforma definitiva para evaluar y descubrir productos de supermercados españoles.
            Comparte tus experiencias y encuentra los mejores productos.
          </p>
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
            onClick={() => setLocation("/auth")}
          >
            Iniciar Sesión
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Explora Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Navega por miles de productos organizados por categorías
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Valora y Opina</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comparte tu experiencia con valoraciones detalladas
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Sube Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Añade nuevos productos que no encuentres en el catálogo
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Únete a una comunidad de compradores inteligentes
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Más de 40 supermercados españoles
          </h2>
          <p className="text-gray-600 mb-8">
            Desde Mercadona hasta El Corte Inglés, encuentra productos de todas las cadenas principales
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full shadow">Mercadona</span>
            <span className="bg-white px-3 py-1 rounded-full shadow">Carrefour</span>
            <span className="bg-white px-3 py-1 rounded-full shadow">Lidl</span>
            <span className="bg-white px-3 py-1 rounded-full shadow">Eroski</span>
            <span className="bg-white px-3 py-1 rounded-full shadow">DIA</span>
            <span className="bg-white px-3 py-1 rounded-full shadow">Y muchos más...</span>
          </div>
        </div>
      </div>
    </div>
  );
}