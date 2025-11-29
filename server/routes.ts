import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSubmissionSchema, insertChatMessageSchema } from "@shared/schema";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the widget SDK file
  app.get("/widget-sdk.js", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/widget-sdk.js"));
  });
  // Form submission endpoint
  app.post("/api/forms/submit", async (req, res) => {
    try {
      const validatedData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validatedData);
      res.json({ success: true, submission });
    } catch (error) {
      console.error("Form submission error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid form data" 
      });
    }
  });

  // Get all form submissions (for admin/demo purposes)
  app.get("/api/forms/submissions", async (_req, res) => {
    try {
      const submissions = await storage.getAllFormSubmissions();
      res.json({ success: true, submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch submissions" 
      });
    }
  });

  // Chat message endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(validatedData);
      
      // Auto-respond with a bot message for demo purposes
      const botResponse = await storage.createChatMessage({
        sessionId: validatedData.sessionId,
        text: "Thanks for your message! A support agent will respond soon.",
        sender: "bot"
      });
      
      res.json({ 
        success: true, 
        userMessage: message,
        botResponse 
      });
    } catch (error) {
      console.error("Chat message error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid message data" 
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessagesBySession(sessionId);
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch chat history" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
