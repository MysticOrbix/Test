import { useMemo } from "react";

interface ChannelHeaderProps {
  channel: {
    id: string;
    title: string;
    description?: string;
    customUrl?: string;
    thumbnailUrl?: string;
    subscriberCount?: number;
    videoCount?: number;
    viewCount?: number;
    joinDate?: string;
  };
}

const ChannelHeader = ({ channel }: ChannelHeaderProps) => {
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
  
  const formattedSubscribers = useMemo(() => formatNumber(channel.subscriberCount), [channel.subscriberCount]);
  const formattedViews = useMemo(() => formatNumber(channel.viewCount), [channel.viewCount]);
  
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center">
      {channel.thumbnailUrl ? (
        <img 
          src={channel.thumbnailUrl} 
          alt={`${channel.title} channel avatar`} 
          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
        </div>
      )}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold mb-2">{channel.title}</h2>
        <p className="text-youtube-gray mb-3">{channel.description || "No description available"}</p>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-youtube-gray mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
            <span className="font-medium">{formattedSubscribers} subscribers</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-youtube-gray mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span className="font-medium">{formattedViews} views</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-youtube-gray mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
            </svg>
            <span className="font-medium">{channel.videoCount || "N/A"} videos</span>
          </div>
          {channel.joinDate && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-youtube-gray mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium">Joined {channel.joinDate}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChannelHeader;
