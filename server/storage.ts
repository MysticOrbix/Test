import {
  Channel, InsertChannel,
  Video, InsertVideo,
  Category, InsertCategory,
  ContentIdea, InsertContentIdea,
  Recommendation, InsertRecommendation,
  Analytics, InsertAnalytics,
  ChannelAnalysis
} from "@shared/schema";

export interface IStorage {
  // Channel operations
  getChannelById(id: string): Promise<Channel | undefined>;
  getChannelByName(name: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(channelId: string, channel: Partial<InsertChannel>): Promise<Channel | undefined>;
  
  // Video operations
  getVideosByChannelId(channelId: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Category operations
  getCategoriesByChannelId(channelId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Content idea operations
  getContentIdeasByChannelId(channelId: string): Promise<ContentIdea[]>;
  createContentIdea(contentIdea: InsertContentIdea): Promise<ContentIdea>;
  
  // Recommendation operations
  getRecommendationsByChannelId(channelId: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  // Analytics operations
  getAnalyticsByChannelId(channelId: string): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(channelId: string, analytics: Partial<InsertAnalytics>): Promise<Analytics | undefined>;
  
  // Get complete channel analysis
  getChannelAnalysis(channelId: string): Promise<ChannelAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private channels: Map<number, Channel>;
  private videos: Map<number, Video>;
  private categories: Map<number, Category>;
  private contentIdeas: Map<number, ContentIdea>;
  private recommendations: Map<number, Recommendation>;
  private analytics: Map<number, Analytics>;
  
  private currentIds: {
    channel: number;
    video: number;
    category: number;
    contentIdea: number;
    recommendation: number;
    analytics: number;
  };

  constructor() {
    this.channels = new Map();
    this.videos = new Map();
    this.categories = new Map();
    this.contentIdeas = new Map();
    this.recommendations = new Map();
    this.analytics = new Map();
    
    this.currentIds = {
      channel: 1,
      video: 1,
      category: 1,
      contentIdea: 1,
      recommendation: 1,
      analytics: 1
    };
  }

  // Channel operations
  async getChannelById(id: string): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(
      (channel) => channel.channelId === id
    );
  }

  async getChannelByName(name: string): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(
      (channel) => {
        // Check by title or customUrl
        return channel.title.toLowerCase().includes(name.toLowerCase()) || 
               (channel.customUrl && channel.customUrl.toLowerCase().includes(name.toLowerCase()));
      }
    );
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const id = this.currentIds.channel++;
    const newChannel: Channel = { ...channel, id };
    this.channels.set(id, newChannel);
    return newChannel;
  }

  async updateChannel(channelId: string, channel: Partial<InsertChannel>): Promise<Channel | undefined> {
    const existing = await this.getChannelById(channelId);
    if (!existing) return undefined;
    
    const updated: Channel = { ...existing, ...channel };
    this.channels.set(existing.id, updated);
    return updated;
  }

  // Video operations
  async getVideosByChannelId(channelId: string): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.channelId === channelId
    );
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentIds.video++;
    const newVideo: Video = { ...video, id };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  // Category operations
  async getCategoriesByChannelId(channelId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.channelId === channelId
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentIds.category++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Content idea operations
  async getContentIdeasByChannelId(channelId: string): Promise<ContentIdea[]> {
    return Array.from(this.contentIdeas.values()).filter(
      (idea) => idea.channelId === channelId
    );
  }

  async createContentIdea(contentIdea: InsertContentIdea): Promise<ContentIdea> {
    const id = this.currentIds.contentIdea++;
    const newIdea: ContentIdea = { ...contentIdea, id };
    this.contentIdeas.set(id, newIdea);
    return newIdea;
  }

  // Recommendation operations
  async getRecommendationsByChannelId(channelId: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.channelId === channelId
    );
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentIds.recommendation++;
    const newRecommendation: Recommendation = { ...recommendation, id };
    this.recommendations.set(id, newRecommendation);
    return newRecommendation;
  }

  // Analytics operations
  async getAnalyticsByChannelId(channelId: string): Promise<Analytics | undefined> {
    return Array.from(this.analytics.values()).find(
      (analytics) => analytics.channelId === channelId
    );
  }

  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentIds.analytics++;
    const newAnalytics: Analytics = { ...analytics, id };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }

  async updateAnalytics(channelId: string, analytics: Partial<InsertAnalytics>): Promise<Analytics | undefined> {
    const existing = await this.getAnalyticsByChannelId(channelId);
    if (!existing) return undefined;
    
    const updated: Analytics = { ...existing, ...analytics };
    this.analytics.set(existing.id, updated);
    return updated;
  }

  // Get complete channel analysis
  async getChannelAnalysis(channelId: string): Promise<ChannelAnalysis | undefined> {
    const channel = await this.getChannelById(channelId);
    if (!channel) return undefined;
    
    const analytics = await this.getAnalyticsByChannelId(channelId) || {
      id: 0,
      channelId,
      avgViews: 0,
      engagementRate: "0%",
      newSubscribers: 0,
      avgViewsChange: 0,
      engagementRateChange: "0%",
      newSubscribersChange: 0
    };
    
    const topVideos = await this.getVideosByChannelId(channelId);
    const categories = await this.getCategoriesByChannelId(channelId);
    const contentIdeas = await this.getContentIdeasByChannelId(channelId);
    const recommendations = await this.getRecommendationsByChannelId(channelId);
    
    return {
      channel: {
        id: channel.channelId,
        title: channel.title,
        description: channel.description || "",
        customUrl: channel.customUrl,
        thumbnailUrl: channel.thumbnailUrl,
        subscriberCount: channel.subscriberCount,
        videoCount: channel.videoCount,
        viewCount: channel.viewCount,
        joinDate: channel.joinDate
      },
      analytics: {
        avgViews: analytics.avgViews,
        engagementRate: analytics.engagementRate,
        newSubscribers: analytics.newSubscribers,
        avgViewsChange: analytics.avgViewsChange,
        engagementRateChange: analytics.engagementRateChange,
        newSubscribersChange: analytics.newSubscribersChange
      },
      topVideos: topVideos.map(video => ({
        id: video.videoId,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        viewCount: video.viewCount,
        likeCount: video.likeCount
      })),
      categories: categories.map(category => ({
        name: category.name,
        percentage: category.percentage
      })),
      contentIdeas: contentIdeas.map(idea => ({
        title: idea.title,
        description: idea.description,
        potential: idea.potential,
        ideaType: idea.ideaType
      })),
      recommendations: recommendations.map(recommendation => ({
        title: recommendation.title,
        content: recommendation.content,
        type: recommendation.type
      }))
    };
  }
}

export const storage = new MemStorage();
