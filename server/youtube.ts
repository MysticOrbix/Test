import {
  Channel, InsertChannel,
  Video, InsertVideo,
  Category, InsertCategory,
  Analytics, InsertAnalytics
} from "@shared/schema";

import { storage } from "./storage";

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

// Function to get a YouTube channel by name or URL
export async function getYouTubeChannel(channelNameOrUrl: string): Promise<YouTubeChannel | null> {
  try {
    // Extract channel ID, username, or custom URL from input
    const sanitizedInput = sanitizeChannelInput(channelNameOrUrl);
    
    // Build API URL based on input type
    let apiUrl = '';
    
    if (sanitizedInput.startsWith('UC')) {
      // It's a channel ID
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${sanitizedInput}`;
    } else {
      // It's a username or custom URL
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${sanitizedInput}`;
    }
    
    apiUrl += `&key=${process.env.YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      // If no results with username, try searching by custom URL
      if (!sanitizedInput.startsWith('UC')) {
        return await searchChannelByKeyword(sanitizedInput);
      }
      return null;
    }
    
    return data.items[0] as YouTubeChannel;
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return null;
  }
}

// Function to search for a channel by keyword
async function searchChannelByKeyword(keyword: string): Promise<YouTubeChannel | null> {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=channel&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    const channelId = data.items[0].id.channelId;
    
    // Get full channel details
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return null;
    }
    
    return channelData.items[0] as YouTubeChannel;
  } catch (error) {
    console.error("Error searching for YouTube channel:", error);
    return null;
  }
}

// Function to get a channel's videos
export async function getChannelVideos(channelId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    // First, get the channel's uploads playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    
    // Get the videos from the uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${process.env.YOUTUBE_API_KEY}`;
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return [];
    }
    
    // Get the video IDs
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    
    // Get the video details including statistics
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      return [];
    }
    
    return videosData.items as YouTubeVideo[];
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    return [];
  }
}

// Helper function to sanitize channel input
function sanitizeChannelInput(input: string): string {
  // Remove whitespace
  let sanitized = input.trim();
  
  // Extract channel ID, username, or custom URL from different formats
  
  // If it's a full YouTube URL
  if (sanitized.includes('youtube.com/')) {
    // Extract the channel ID, username, or custom URL
    const parts = sanitized.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (sanitized.includes('/channel/')) {
      // It's a channel URL (e.g., youtube.com/channel/UC...)
      return lastPart;
    } else if (sanitized.includes('/user/')) {
      // It's a username URL (e.g., youtube.com/user/username)
      return lastPart;
    } else if (sanitized.includes('/c/')) {
      // It's a custom URL (e.g., youtube.com/c/customname)
      return lastPart;
    } else if (sanitized.includes('/@')) {
      // It's a handle URL (e.g., youtube.com/@handle)
      return lastPart.substring(1); // Remove the @ symbol
    }
  }
  
  // If it's a channel ID (starts with UC)
  if (sanitized.startsWith('UC') && sanitized.length > 20) {
    return sanitized;
  }
  
  // If it's a handle (@name)
  if (sanitized.startsWith('@')) {
    return sanitized.substring(1);
  }
  
  // Otherwise, treat it as a username or search term
  return sanitized;
}

// Function to generate content categories based on video titles
export function generateContentCategories(videos: YouTubeVideo[]): Category[] {
  if (!videos || videos.length === 0) {
    return [];
  }
  
  const categories: Map<string, number> = new Map();
  const keywords: Map<string, number> = new Map();
  
  // Extract keywords from titles
  videos.forEach(video => {
    const title = video.snippet.title.toLowerCase();
    
    // Check for common categories
    if (title.includes('review')) {
      incrementCategory(categories, 'Reviews');
    } else if (title.includes('how to') || title.includes('tutorial') || title.includes('guide')) {
      incrementCategory(categories, 'Tutorials & Guides');
    } else if (title.includes('unboxing')) {
      incrementCategory(categories, 'Unboxing');
    } else if (title.includes('comparison') || title.includes('vs')) {
      incrementCategory(categories, 'Comparisons');
    } else if (title.includes('news') || title.includes('update')) {
      incrementCategory(categories, 'News & Updates');
    } else {
      // Extract product types
      if (title.includes('iphone') || title.includes('android') || title.includes('smartphone') || title.includes('phone')) {
        incrementCategory(categories, 'Smartphone Content');
      } else if (title.includes('laptop') || title.includes('macbook') || title.includes('pc')) {
        incrementCategory(categories, 'Laptop & PC Content');
      } else if (title.includes('camera') || title.includes('photography')) {
        incrementCategory(categories, 'Camera & Photography');
      } else if (title.includes('headphone') || title.includes('earbuds') || title.includes('audio')) {
        incrementCategory(categories, 'Audio Products');
      } else if (title.includes('gaming')) {
        incrementCategory(categories, 'Gaming Content');
      } else {
        incrementCategory(categories, 'Other Content');
      }
    }
  });
  
  // Calculate total for percentages
  const total = Array.from(categories.values()).reduce((sum, count) => sum + count, 0);
  
  // Convert to percentages and sort
  const categoriesArray = Array.from(categories.entries())
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  return categoriesArray;
}

// Helper function to increment a category count
function incrementCategory(categories: Map<string, number>, category: string): void {
  const current = categories.get(category) || 0;
  categories.set(category, current + 1);
}

// Function to generate analytics data from channel and videos
export function generateAnalytics(
  channel: YouTubeChannel,
  videos: YouTubeVideo[]
): Analytics {
  // Calculate average views
  const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || '0'), 0);
  const avgViews = Math.round(totalViews / (videos.length || 1));
  
  // Calculate engagement rate (likes + comments) / views
  const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || '0'), 0);
  const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || '0'), 0);
  const engagementRate = ((totalLikes + totalComments) / totalViews * 100).toFixed(1) + '%';
  
  // Estimate new subscribers (about 1-5% of total subs per month)
  const subscriberCount = parseInt(channel.statistics.subscriberCount || '0');
  const newSubscribers = Math.round(subscriberCount * (Math.random() * 0.04 + 0.01));
  
  // Generate random changes for demo purposes
  const avgViewsChange = Math.round((Math.random() * 0.2 - 0.1) * avgViews);
  const engagementRateChange = ((Math.random() * 0.02 - 0.01) * parseFloat(engagementRate)).toFixed(1) + '%';
  const newSubscribersChange = Math.round((Math.random() * 0.2 - 0.1) * newSubscribers);
  
  return {
    id: 0, // Will be set by storage
    channelId: channel.id,
    avgViews,
    engagementRate,
    newSubscribers,
    avgViewsChange,
    engagementRateChange,
    newSubscribersChange
  };
}

// Main function to process a channel and store all data
export async function processYouTubeChannel(channelNameOrUrl: string) {
  // Get the channel
  const youtubeChannel = await getYouTubeChannel(channelNameOrUrl);
  if (!youtubeChannel) {
    throw new Error("Channel not found");
  }
  
  // Check if we already have this channel in storage
  let channel = await storage.getChannelById(youtubeChannel.id);
  
  // Create or update channel
  if (!channel) {
    // Create new channel
    const thumbnailUrl = youtubeChannel.snippet.thumbnails.high?.url || 
                        youtubeChannel.snippet.thumbnails.medium?.url || 
                        youtubeChannel.snippet.thumbnails.default?.url;
    
    // Format join date
    const publishedDate = new Date(youtubeChannel.snippet.publishedAt);
    const joinDate = publishedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    const channelData: InsertChannel = {
      channelId: youtubeChannel.id,
      title: youtubeChannel.snippet.title,
      description: youtubeChannel.snippet.description,
      customUrl: youtubeChannel.snippet.customUrl,
      thumbnailUrl,
      subscriberCount: parseInt(youtubeChannel.statistics.subscriberCount || '0'),
      videoCount: parseInt(youtubeChannel.statistics.videoCount || '0'),
      viewCount: parseInt(youtubeChannel.statistics.viewCount || '0'),
      joinDate,
      lastUpdated: new Date().toISOString()
    };
    
    channel = await storage.createChannel(channelData);
  } else {
    // Update existing channel
    await storage.updateChannel(youtubeChannel.id, {
      lastUpdated: new Date().toISOString()
    });
  }
  
  // Get videos
  const youtubeVideos = await getChannelVideos(youtubeChannel.id, 20);
  
  // Store videos if not already stored
  for (const youtubeVideo of youtubeVideos) {
    // Create video
    const videoData: InsertVideo = {
      videoId: youtubeVideo.id,
      channelId: youtubeChannel.id,
      title: youtubeVideo.snippet.title,
      description: youtubeVideo.snippet.description,
      thumbnailUrl: youtubeVideo.snippet.thumbnails.medium?.url || youtubeVideo.snippet.thumbnails.default?.url,
      publishedAt: youtubeVideo.snippet.publishedAt,
      viewCount: parseInt(youtubeVideo.statistics.viewCount || '0'),
      likeCount: parseInt(youtubeVideo.statistics.likeCount || '0'),
      commentCount: parseInt(youtubeVideo.statistics.commentCount || '0')
    };
    
    await storage.createVideo(videoData);
  }
  
  // Generate content categories
  const contentCategories = generateContentCategories(youtubeVideos);
  
  // Store categories
  for (const category of contentCategories) {
    const categoryData: InsertCategory = {
      channelId: youtubeChannel.id,
      name: category.name,
      percentage: category.percentage
    };
    
    await storage.createCategory(categoryData);
  }
  
  // Generate and store analytics
  const analyticsData = generateAnalytics(youtubeChannel, youtubeVideos);
  await storage.createAnalytics(analyticsData);
  
  return youtubeChannel.id;
}
