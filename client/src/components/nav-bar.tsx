import { Link, useLocation } from "wouter";
import { Home, PlusCircle, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function NavBar() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className={`flex flex-col items-center ${location === "/" ? "text-primary" : "text-gray-600"}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Inicio</span>
          </Link>
          
          <Link href="/tops" className={`flex flex-col items-center ${location === "/tops" ? "text-primary" : "text-gray-600"}`}>
            <Trophy className="h-6 w-6" />
            <span className="text-xs mt-1">Tops</span>
          </Link>
          
          <Link href="/upload" className={`flex flex-col items-center ${location === "/upload" ? "text-primary" : "text-gray-600"}`}>
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Subir</span>
          </Link>
          
          <Link href="/my-opis" className={`flex flex-col items-center ${location === "/my-opis" ? "text-primary" : "text-gray-600"}`}>
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Mis Opis</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}