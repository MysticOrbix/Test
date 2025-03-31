import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// YouTube channel schema
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  customUrl: text("custom_url"),
  thumbnailUrl: text("thumbnail_url"),
  subscriberCount: integer("subscriber_count"),
  videoCount: integer("video_count"),
  viewCount: integer("view_count"),
  joinDate: text("join_date"),
  lastUpdated: text("last_updated"),
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
});

// Top performing videos schema
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull().unique(),
  channelId: text("channel_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: text("published_at"),
  viewCount: integer("view_count"),
  likeCount: integer("like_count"),
  commentCount: integer("comment_count"),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
});

// Content categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull(),
  name: text("name").notNull(),
  percentage: integer("percentage").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Content ideas schema
export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  potential: text("potential"),
  ideaType: text("idea_type").notNull(), // trending, high_engagement, quick_win, audience_request
});

export const insertContentIdeaSchema = createInsertSchema(contentIdeas).omit({
  id: true,
});

// Recommendation schema for AI-powered recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // audience_growth, content_optimization, audience_engagement
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
});

// Analytics schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull().unique(),
  avgViews: integer("avg_views"),
  engagementRate: text("engagement_rate"),
  newSubscribers: integer("new_subscribers"),
  avgViewsChange: integer("avg_views_change"),
  engagementRateChange: text("engagement_rate_change"),
  newSubscribersChange: integer("new_subscribers_change"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

// Complete channel analysis result schema
export const channelAnalysisSchema = z.object({
  channel: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    customUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    subscriberCount: z.number().optional(),
    videoCount: z.number().optional(),
    viewCount: z.number().optional(),
    joinDate: z.string().optional(),
  }),
  analytics: z.object({
    avgViews: z.number().optional(),
    engagementRate: z.string().optional(),
    newSubscribers: z.number().optional(),
    avgViewsChange: z.number().optional(),
    engagementRateChange: z.string().optional(),
    newSubscribersChange: z.number().optional(),
  }),
  topVideos: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      thumbnailUrl: z.string().optional(),
      viewCount: z.number().optional(),
      likeCount: z.number().optional(),
    })
  ),
  categories: z.array(
    z.object({
      name: z.string(),
      percentage: z.number(),
    })
  ),
  contentIdeas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      potential: z.string().optional(),
      ideaType: z.string(),
    })
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      type: z.string(),
    })
  ),
});

// Types
export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type ContentIdea = typeof contentIdeas.$inferSelect;
export type InsertContentIdea = z.infer<typeof insertContentIdeaSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type ChannelAnalysis = z.infer<typeof channelAnalysisSchema>;
