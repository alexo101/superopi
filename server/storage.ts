import { products, users, type Product, type InsertProduct, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, like, sql } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  
  // User authentication methods
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User contributions methods
  getProductsByUser(userId: number): Promise<Product[]>;
  getTopContributors(): Promise<{ username: string; contributions: number; rank: number }[]>;
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
        like(sql`LOWER(${products.name})`, searchPattern)
      );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProductsByUser(userId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(sql`${products.createdAt} DESC`);
  }

  async getTopContributors(): Promise<{ username: string; contributions: number; rank: number }[]> {
    const result = await db
      .select({
        username: users.username,
        contributions: sql<number>`COUNT(${products.id})::int`,
      })
      .from(users)
      .leftJoin(products, eq(users.id, products.userId))
      .groupBy(users.id, users.username)
      .having(sql`COUNT(${products.id}) > 0`)
      .orderBy(sql`COUNT(${products.id}) DESC`)
      .limit(10);

    return result.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  async getTrendingProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .orderBy(sql`${products.reviewCount} DESC`)
      .limit(20);
  }
}

export const storage = new DatabaseStorage();