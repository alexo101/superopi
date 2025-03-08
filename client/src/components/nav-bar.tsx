import { Link, useLocation } from "wouter";
import { Home, Search, PlusCircle } from "lucide-react";

export default function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link href="/">
            <a className={`flex flex-col items-center ${location === "/" ? "text-primary" : "text-gray-600"}`}>
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          <Link href="/search">
            <a className={`flex flex-col items-center ${location === "/search" ? "text-primary" : "text-gray-600"}`}>
              <Search className="h-6 w-6" />
              <span className="text-xs mt-1">Search</span>
            </a>
          </Link>
          <Link href="/upload">
            <a className={`flex flex-col items-center ${location === "/upload" ? "text-primary" : "text-gray-600"}`}>
              <PlusCircle className="h-6 w-6" />
              <span className="text-xs mt-1">Upload</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
