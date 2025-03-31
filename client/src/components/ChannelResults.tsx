import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChannelAnalysis } from "@shared/schema";
import ChannelHeader from "./ChannelHeader";
import ChannelAnalytics from "./ChannelAnalytics";
import ContentAnalysis from "./ContentAnalysis";
import ContentIdeas from "./ContentIdeas";
import AIRecommendations from "./AIRecommendations";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface ChannelResultsProps {
  channelId: string | null;
  onTryAgain: () => void;
}

const ChannelResults = ({ channelId, onTryAgain }: ChannelResultsProps) => {
  const { toast } = useToast();
  
  const { data: analysis, isLoading, isError, error, refetch } = useQuery<ChannelAnalysis>({
    queryKey: [`/api/channel-analysis/${channelId}`],
    enabled: !!channelId,
  });

  const generateMoreIdeas = useMutation({
    mutationFn: async () => {
      if (!channelId) throw new Error("Channel ID is missing");
      const res = await apiRequest("POST", `/api/generate-more-ideas/${channelId}`);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Generated new content ideas!",
        });
        refetch();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to generate more ideas.",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate more ideas.",
      });
    },
  });

  const handleGenerateMoreIdeas = () => {
    generateMoreIdeas.mutate();
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (isError || !analysis) {
    return (
      <ErrorState 
        onTryAgain={onTryAgain}
        errorMessage={error instanceof Error ? error.message : "Failed to load channel analysis. Please try again."}
      />
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <ChannelHeader channel={analysis.channel} />
      <ChannelAnalytics analytics={analysis.analytics} />
      <ContentAnalysis topVideos={analysis.topVideos} categories={analysis.categories} />
      <ContentIdeas 
        contentIdeas={analysis.contentIdeas} 
        onGenerateMore={handleGenerateMoreIdeas}
        isGenerating={generateMoreIdeas.isPending}
      />
      <AIRecommendations recommendations={analysis.recommendations} />
    </div>
  );
};

export default ChannelResults;
