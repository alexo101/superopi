import { pgTable, text, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = [
  { id: 1, name: "Alimentación", icon: "🍽️" },
  { id: 2, name: "Bebidas", icon: "🥤" },
  { id: 3, name: "Higiene Personal", icon: "🧴" },
  { id: 4, name: "Limpieza hogar", icon: "🧹" },
  { id: 5, name: "Mascotas", icon: "🐾" }
];

export const supermarkets = [
  "Mercadona", "Carrefour", "Lidl", "Grupo Eroski", "Grupo Dia", 
  "Consum Coop.", "Alcampo (Auchan)", "El Corte Inglés", "Aldi", 
  "Condis", "Ahorramas", "Supercor", "BM Supermercados", "Gadisa",
  "Bon Preu", "Covirán", "Froiz", "Masymas", "HiperDino", "E.Leclerc",
  "Spar", "Uvesco", "SuperSol", "Caprabo", "Makro", "La Despensa",
  "Casa Ametller", "Lupa", "Alimerka", "La Plaza de Dia", "Cash Fresh",
  "Economy Cash", "Jespac", "Hiper Usera", "Novavenda", 
  "Autoservicios Familia", "Suma", "Ressa", "Charter", "Punt Fresc",
  "El Árbol", "Cash EcoFamilia", "Hiperber"
] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 10 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  rating: integer("rating").notNull(),
  categoryId: integer("category_id").notNull(),
  supermarket: text("supermarket").notNull(),
  imageUrl: text("image_url").notNull(),
  sweetness: integer("sweetness").notNull().default(5),
  saltiness: integer("saltiness").notNull().default(5),
  smell: integer("smell").notNull().default(5),
  effectiveness: integer("effectiveness").notNull().default(5),
});

export const insertProductSchema = createInsertSchema(products)
  .extend({
    rating: z.number().min(0).max(10),
    supermarket: z.enum(supermarkets),
    categoryId: z.number().min(1).max(categories.length),
    sweetness: z.number().min(1).max(10).default(5),
    saltiness: z.number().min(1).max(10).default(5),
    smell: z.number().min(1).max(10).default(5),
    effectiveness: z.number().min(1).max(10).default(5),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    email: z.string().email("Email inválido"),
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").max(10, "El nombre de usuario no puede tener más de 10 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;