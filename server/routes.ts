import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processYouTubeChannel } from "./youtube";
import { generateContentIdeasAndRecommendations } from "./openai";
import { channelAnalysisSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze a YouTube channel
  app.post("/api/analyze-channel", async (req: Request, res: Response) => {
    try {
      const { channelName } = req.body;
      
      if (!channelName) {
        return res.status(400).json({ 
          error: "Channel name is required" 
        });
      }
      
      // Process the channel and get the channel ID
      const channelId = await processYouTubeChannel(channelName);
      
      // Return the channel ID for client to fetch analysis
      res.json({ 
        success: true, 
        channelId 
      });
    } catch (error) {
      console.error("Error analyzing channel:", error);
      
      // Handle specific errors
      if (error.message === "Channel not found") {
        return res.status(404).json({ 
          error: "Channel not found. Please check the channel name and try again." 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to analyze channel. Please try again later." 
      });
    }
  });

  // API endpoint to get channel analysis
  app.get("/api/channel-analysis/:channelId", async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      
      if (!channelId) {
        return res.status(400).json({ 
          error: "Channel ID is required" 
        });
      }
      
      // Check if we need to generate content ideas
      const analysis = await storage.getChannelAnalysis(channelId);
      
      if (!analysis) {
        return res.status(404).json({ 
          error: "Channel analysis not found" 
        });
      }
      
      // Check if we already have content ideas and recommendations
      if (analysis.contentIdeas.length === 0 || analysis.recommendations.length === 0) {
        // Generate content ideas and recommendations
        const videos = await storage.getVideosByChannelId(channelId);
        const categories = await storage.getCategoriesByChannelId(channelId);
        
        const videoTitles = videos.map(video => video.title);
        
        const { contentIdeas, recommendations } = await generateContentIdeasAndRecommendations(
          analysis.channel.title,
          analysis.channel.description,
          videoTitles,
          categories.map(cat => ({ name: cat.name, percentage: cat.percentage }))
        );
        
        // Store content ideas
        for (const idea of contentIdeas) {
          await storage.createContentIdea({
            channelId,
            title: idea.title,
            description: idea.description,
            potential: idea.potential,
            ideaType: idea.ideaType
          });
        }
        
        // Store recommendations
        for (const recommendation of recommendations) {
          await storage.createRecommendation({
            channelId,
            title: recommendation.title,
            content: recommendation.content,
            type: recommendation.type
          });
        }
        
        // Get the updated analysis
        const updatedAnalysis = await storage.getChannelAnalysis(channelId);
        
        // Validate with zod schema
        const parsed = channelAnalysisSchema.parse(updatedAnalysis);
        
        return res.json(parsed);
      }
      
      // Validate with zod schema
      const parsed = channelAnalysisSchema.parse(analysis);
      
      res.json(parsed);
    } catch (error) {
      console.error("Error getting channel analysis:", error);
      
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: validationError.message 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to get channel analysis. Please try again later." 
      });
    }
  });

  // API endpoint to generate more content ideas
  app.post("/api/generate-more-ideas/:channelId", async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      
      if (!channelId) {
        return res.status(400).json({ 
          error: "Channel ID is required" 
        });
      }
      
      // Get channel data
      const channel = await storage.getChannelById(channelId);
      
      if (!channel) {
        return res.status(404).json({ 
          error: "Channel not found" 
        });
      }
      
      // Get existing videos and categories
      const videos = await storage.getVideosByChannelId(channelId);
      const categories = await storage.getCategoriesByChannelId(channelId);
      
      const videoTitles = videos.map(video => video.title);
      
      // Generate new content ideas
      const { contentIdeas } = await generateContentIdeasAndRecommendations(
        channel.title,
        channel.description || "",
        videoTitles,
        categories.map(cat => ({ name: cat.name, percentage: cat.percentage }))
      );
      
      // Store new content ideas
      for (const idea of contentIdeas) {
        await storage.createContentIdea({
          channelId,
          title: idea.title,
          description: idea.description,
          potential: idea.potential,
          ideaType: idea.ideaType
        });
      }
      
      // Return the new ideas
      res.json({ 
        success: true, 
        contentIdeas 
      });
    } catch (error) {
      console.error("Error generating more ideas:", error);
      res.status(500).json({ 
        error: "Failed to generate more ideas. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
