import { products, type Product, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, like } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(products)
      .where(
        like(products.name.toLowerCase(), searchPattern)
      );
  }
}

export const storage = new DatabaseStorage();