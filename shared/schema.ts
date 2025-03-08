import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = [
  { id: 1, name: "Alimentación", icon: "🍽️" },
  { id: 2, name: "Bebidas", icon: "🥤" },
  { id: 3, name: "Frescos", icon: "🥬" },
  { id: 4, name: "Congelados", icon: "❄️" },
  { id: 5, name: "Limpieza", icon: "🧹" },
  { id: 6, name: "Higiene", icon: "🧴" },
  { id: 7, name: "Hogar", icon: "🏠" },
  { id: 8, name: "Mascotas", icon: "🐾" }
];

export const supermarkets = [
  "Mercadona", "Carrefour", "Lidl", "Aldi", "Dia", "Eroski",
  "Alcampo", "El Corte Inglés", "Hipercor", "Consum"
] as const;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rating: integer("rating").notNull(),
  categoryId: integer("category_id").notNull(),
  supermarket: text("supermarket").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertProductSchema = createInsertSchema(products)
  .extend({
    rating: z.number().min(0).max(10),
    supermarket: z.enum(supermarkets),
    categoryId: z.number().min(1).max(categories.length),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
