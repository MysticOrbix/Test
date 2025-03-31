import { useState } from "react";

interface ContentIdeasProps {
  contentIdeas: {
    title: string;
    description: string;
    potential?: string;
    ideaType: string;
  }[];
  onGenerateMore: () => void;
  isGenerating: boolean;
}

const ContentIdeas = ({ contentIdeas, onGenerateMore, isGenerating }: ContentIdeasProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  // Get type label and colors
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "trending":
        return { 
          label: "Trending Topic", 
          bgColor: "bg-red-100", 
          textColor: "text-youtube-red" 
        };
      case "high_engagement":
        return { 
          label: "High Engagement", 
          bgColor: "bg-green-100", 
          textColor: "text-green-700" 
        };
      case "quick_win":
        return { 
          label: "Quick Win", 
          bgColor: "bg-blue-100", 
          textColor: "text-blue-700" 
        };
      case "audience_request":
        return { 
          label: "Audience Request", 
          bgColor: "bg-purple-100", 
          textColor: "text-purple-700" 
        };
      default:
        return { 
          label: "Content Idea", 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        };
    }
  };
  
  // Filter ideas by type
  const filteredIdeas = contentIdeas.filter(idea => 
    filter === "all" || idea.ideaType === filter
  );
  
  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-bold">Content Ideas for Your Channel</h3>
        
        {/* Filters */}
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-youtube-red text-white" 
                : "bg-white text-youtube-gray hover:bg-gray-100"
            }`}
            onClick={() => setFilter("all")}
          >
            All Ideas
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "trending" 
                ? "bg-youtube-red text-white" 
                : "bg-white text-youtube-gray hover:bg-gray-100"
            }`}
            onClick={() => setFilter("trending")}
          >
            Trending
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "high_engagement" 
                ? "bg-youtube-red text-white" 
                : "bg-white text-youtube-gray hover:bg-gray-100"
            }`}
            onClick={() => setFilter("high_engagement")}
          >
            High Engagement
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "quick_win" 
                ? "bg-youtube-red text-white" 
                : "bg-white text-youtube-gray hover:bg-gray-100"
            }`}
            onClick={() => setFilter("quick_win")}
          >
            Quick Wins
          </button>
        </div>
      </div>
      
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.map((idea, index) => {
            const typeInfo = getTypeInfo(idea.ideaType);
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-5">
                <div className="flex justify-between mb-3">
                  <span className={`px-3 py-1 ${typeInfo.bgColor} ${typeInfo.textColor} text-xs font-medium rounded-full`}>
                    {typeInfo.label}
                  </span>
                  <button className="text-youtube-gray hover:text-youtube-text">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                  </button>
                </div>
                <h4 className="text-lg font-semibold mb-2">{idea.title}</h4>
                <p className="text-youtube-gray mb-4">{idea.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-youtube-gray">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                    </svg>
                    <span>{idea.potential || "Est. views: 100K+"}</span>
                  </div>
                  <button className="text-youtube-blue hover:text-blue-700 text-sm font-medium">
                    Use This Idea
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-5 text-center">
          <p className="text-youtube-gray mb-4">No content ideas found for the selected filter.</p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button 
          className="px-6 py-3 bg-youtube-dark text-white rounded-lg hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={onGenerateMore}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate More Ideas"}
        </button>
      </div>
    </section>
  );
};

export default ContentIdeas;
