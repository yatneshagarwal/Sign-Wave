import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGestureSchema } from "@shared/schema";
import { analyzeGestureImage } from "./ai-gesture-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new gesture record
  app.post("/api/gestures", async (req, res) => {
    try {
      const gestureData = insertGestureSchema.parse(req.body);
      const gesture = await storage.createGesture(gestureData);
      res.json(gesture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid gesture data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create gesture" });
      }
    }
  });

  // Get gestures by region
  app.get("/api/gestures/region/:region", async (req, res) => {
    try {
      const region = req.params.region;
      const gestures = await storage.getGesturesByRegion(region);
      res.json(gestures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gestures" });
    }
  });

  // Get recent gestures
  app.get("/api/gestures/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const gestures = await storage.getRecentGestures(limit);
      res.json(gestures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent gestures" });
    }
  });

  // AI gesture analysis endpoint
  app.post("/api/analyze-gesture", async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Remove data:image/jpeg;base64, prefix if present
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const result = await analyzeGestureImage(base64Image);
      
      res.json(result);
    } catch (error) {
      console.error('Gesture analysis error:', error);
      res.status(500).json({ error: "Failed to analyze gesture" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
