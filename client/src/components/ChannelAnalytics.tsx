import { useMemo } from "react";

interface AnalyticsProps {
  analytics: {
    avgViews?: number;
    engagementRate?: string;
    newSubscribers?: number;
    avgViewsChange?: number;
    engagementRateChange?: string;
    newSubscribersChange?: number;
  };
}

const ChannelAnalytics = ({ analytics }: AnalyticsProps) => {
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
  
  const formattedAvgViews = useMemo(() => formatNumber(analytics.avgViews), [analytics.avgViews]);
  const formattedNewSubs = useMemo(() => formatNumber(analytics.newSubscribers), [analytics.newSubscribers]);
  
  const isViewsChangePositive = useMemo(() => (
    analytics.avgViewsChange !== undefined && analytics.avgViewsChange > 0
  ), [analytics.avgViewsChange]);
  
  const isEngagementChangePositive = useMemo(() => {
    if (!analytics.engagementRateChange) return false;
    return !analytics.engagementRateChange.startsWith('-');
  }, [analytics.engagementRateChange]);
  
  const isSubsChangePositive = useMemo(() => (
    analytics.newSubscribersChange !== undefined && analytics.newSubscribersChange > 0
  ), [analytics.newSubscribersChange]);
  
  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-4">Channel Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Views Card */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-youtube-gray text-sm uppercase font-medium mb-1">Average Views</p>
          <h4 className="text-2xl font-bold mb-1">{formattedAvgViews}</h4>
          {analytics.avgViewsChange !== undefined && (
            <p className="text-sm flex items-center">
              <span className={`flex items-center mr-1 ${isViewsChangePositive ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {isViewsChangePositive ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"></path>
                  )}
                </svg>
                {Math.abs(analytics.avgViewsChange).toFixed(1)}%
              </span>
              <span className="text-youtube-gray">vs. previous month</span>
            </p>
          )}
        </div>
        
        {/* Engagement Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-youtube-gray text-sm uppercase font-medium mb-1">Engagement Rate</p>
          <h4 className="text-2xl font-bold mb-1">{analytics.engagementRate || "N/A"}</h4>
          {analytics.engagementRateChange && (
            <p className="text-sm flex items-center">
              <span className={`flex items-center mr-1 ${isEngagementChangePositive ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {isEngagementChangePositive ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"></path>
                  )}
                </svg>
                {analytics.engagementRateChange.replace('-', '')}
              </span>
              <span className="text-youtube-gray">vs. previous month</span>
            </p>
          )}
        </div>
        
        {/* New Subscribers Card */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-youtube-gray text-sm uppercase font-medium mb-1">New Subscribers</p>
          <h4 className="text-2xl font-bold mb-1">{formattedNewSubs}</h4>
          {analytics.newSubscribersChange !== undefined && (
            <p className="text-sm flex items-center">
              <span className={`flex items-center mr-1 ${isSubsChangePositive ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {isSubsChangePositive ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"></path>
                  )}
                </svg>
                {Math.abs(analytics.newSubscribersChange).toFixed(1)}%
              </span>
              <span className="text-youtube-gray">vs. previous month</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChannelAnalytics;
