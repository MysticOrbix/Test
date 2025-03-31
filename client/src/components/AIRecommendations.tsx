interface AIRecommendationsProps {
  recommendations: {
    title: string;
    content: string;
    type: string;
  }[];
}

const AIRecommendations = ({ recommendations }: AIRecommendationsProps) => {
  // Get border color based on recommendation type
  const getBorderColor = (type: string) => {
    switch (type) {
      case "audience_growth":
        return "border-youtube-blue";
      case "content_optimization":
        return "border-green-500";
      case "audience_engagement":
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };
  
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">AI-Powered Recommendations</h3>
      
      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <div key={index} className={`border-l-4 ${getBorderColor(recommendation.type)} pl-4`}>
              <h4 className="text-lg font-semibold mb-2">{recommendation.title}</h4>
              <p className="text-youtube-gray">{recommendation.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-youtube-gray italic">No recommendations available</p>
      )}
    </section>
  );
};

export default AIRecommendations;
