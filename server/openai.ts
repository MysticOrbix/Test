import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

interface ContentIdea {
  title: string;
  description: string;
  potential: string;
  ideaType: string;
}

interface Recommendation {
  title: string;
  content: string;
  type: string;
}

interface GeneratedContent {
  contentIdeas: ContentIdea[];
  recommendations: Recommendation[];
}

export async function generateContentIdeasAndRecommendations(
  channelTitle: string,
  channelDescription: string,
  videoTitles: string[],
  categories: { name: string; percentage: number }[]
): Promise<GeneratedContent> {
  try {
    const prompt = `
      Please analyze this YouTube channel and generate content ideas and recommendations:
      
      Channel name: ${channelTitle}
      Channel description: ${channelDescription}
      
      Recent video titles:
      ${videoTitles.map(title => `- ${title}`).join('\n')}
      
      Content categories:
      ${categories.map(cat => `- ${cat.name}: ${cat.percentage}%`).join('\n')}
      
      Based on this data, please generate:
      
      1. Eight content ideas that would perform well for this channel
      2. Three strategic recommendations for channel growth
      
      Respond with JSON in this format:
      {
        "contentIdeas": [
          {
            "title": "Title of the video idea",
            "description": "Brief description of what the video would cover",
            "potential": "Estimated potential viewership (e.g., 'Est. views: 150K+')",
            "ideaType": "One of: trending, high_engagement, quick_win, audience_request"
          }
        ],
        "recommendations": [
          {
            "title": "Title of recommendation",
            "content": "Detailed explanation of the recommendation",
            "type": "One of: audience_growth, content_optimization, audience_engagement"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a YouTube content strategist who helps creators optimize their channel and generate engaging content ideas. You provide data-driven insights to help creators grow."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content) as GeneratedContent;
    
    // Ensure we have the right number of ideas (limit to 8)
    result.contentIdeas = result.contentIdeas.slice(0, 8);
    
    // Ensure we have 3 recommendations
    if (result.recommendations.length > 3) {
      result.recommendations = result.recommendations.slice(0, 3);
    } else if (result.recommendations.length < 3) {
      // Add default recommendations if we don't have 3
      const defaultTypes = ["audience_growth", "content_optimization", "audience_engagement"];
      const existingTypes = result.recommendations.map(r => r.type);
      
      defaultTypes.forEach(type => {
        if (!existingTypes.includes(type) && result.recommendations.length < 3) {
          result.recommendations.push({
            title: `${type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Strategy`,
            content: `Based on your channel's content, we recommend focusing on ${type.replace('_', ' ')} to improve your channel performance.`,
            type
          });
        }
      });
    }

    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Return fallback data in case of API error
    return {
      contentIdeas: [
        {
          title: "Unable to generate content ideas",
          description: "There was an error connecting to our AI service. Please try again later.",
          potential: "N/A",
          ideaType: "trending"
        }
      ],
      recommendations: [
        {
          title: "Audience Growth Strategy",
          content: "There was an error connecting to our AI service. Please try again later.",
          type: "audience_growth"
        },
        {
          title: "Content Optimization",
          content: "There was an error connecting to our AI service. Please try again later.",
          type: "content_optimization"
        },
        {
          title: "Audience Engagement",
          content: "There was an error connecting to our AI service. Please try again later.",
          type: "audience_engagement"
        }
      ]
    };
  }
}
