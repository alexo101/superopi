import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import express from 'express';
import { setupAuth, requireAuth } from "./auth";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export async function registerRoutes(app: Express) {
  // Setup authentication
  setupAuth(app);

  // Ensure uploads directory exists
  await fs.mkdir("./uploads", { recursive: true });

  app.use("/uploads", express.static("uploads"));

  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/category/:id", async (req, res) => {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }
    console.log(`Fetching products for category ${categoryId}`);
    const products = await storage.getProductsByCategory(categoryId);
    console.log(`Found ${products.length} products:`, products);
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Se requiere un término de búsqueda" });
    }
    const products = await storage.searchProducts(query);
    res.json(products);
  });

  app.post("/api/products", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const productData = { ...req.body, userId };
      const product = insertProductSchema.parse(productData);
      const created = await storage.createProduct(product);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Datos del producto inválidos", errors: error.errors });
      }
      throw error;
    }
  });

  // New endpoints for user contributions
  app.get("/api/my-products", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const products = await storage.getProductsByUser(userId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching user products:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.get("/api/tops", async (req, res) => {
    try {
      const topUsers = await storage.getTopContributors();
      res.json(topUsers);
    } catch (error) {
      console.error("Error fetching top contributors:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.get("/api/trending", async (req, res) => {
    try {
      const trendingProducts = await storage.getTrendingProducts();
      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}