import { useMemo } from "react";

interface ContentAnalysisProps {
  topVideos: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    viewCount?: number;
    likeCount?: number;
  }[];
  categories: {
    name: string;
    percentage: number;
  }[];
}

const ContentAnalysis = ({ topVideos, categories }: ContentAnalysisProps) => {
  // Format numbers with commas and abbreviations
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return "N/A";
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  // Sort categories by percentage (highest first)
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.percentage - a.percentage);
  }, [categories]);
  
  // Sort videos by view count (highest first)
  const sortedVideos = useMemo(() => {
    return [...topVideos]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3); // Take top 3
  }, [topVideos]);
  
  // Fallback thumbnail
  const fallbackThumbnail = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='68' viewBox='0 0 120 68'%3E%3Crect width='120' height='68' fill='%23f0f0f0'/%3E%3Cpath d='M60,34 m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0' fill='%23d0d0d0'/%3E%3Cpath d='M58,34 l8,0 l-4,-7 z' fill='%23ffffff'/%3E%3C/svg%3E";
  
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold mb-6">Content Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Videos */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Top Performing Videos</h4>
          {sortedVideos.length > 0 ? (
            <ul className="space-y-3">
              {sortedVideos.map(video => (
                <li key={video.id} className="border-b border-gray-100 pb-3">
                  <div className="flex">
                    <img 
                      src={video.thumbnailUrl || fallbackThumbnail} 
                      alt={`Thumbnail for ${video.title}`} 
                      className="w-28 h-16 object-cover rounded mr-3"
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackThumbnail }}
                    />
                    <div>
                      <h5 className="font-medium line-clamp-2">{video.title}</h5>
                      <div className="flex text-sm text-youtube-gray mt-1">
                        <span className="flex items-center mr-3">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>{formatNumber(video.viewCount)}</span>
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                          </svg>
                          <span>{formatNumber(video.likeCount)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-youtube-gray italic">No video data available</p>
          )}
        </div>
        
        {/* Content Categories */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Content Categories</h4>
          {sortedCategories.length > 0 ? (
            <div className="space-y-4">
              {sortedCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-youtube-gray">{category.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-youtube-red rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-youtube-gray italic">No category data available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentAnalysis;
