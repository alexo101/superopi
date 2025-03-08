import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { categories } from "@shared/schema";

interface CategoryCardProps {
  category: typeof categories[number];
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <a className="block">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-2">{category.icon}</span>
            <h3 className="font-medium">{category.name}</h3>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
