import { useState } from "react";
import ChannelSearchForm from "@/components/ChannelSearchForm";
import ChannelResults from "@/components/ChannelResults";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  
  const handleAnalysisStart = () => {
    setIsLoading(true);
    setHasError(false);
    setChannelId(null);
  };
  
  const handleAnalysisComplete = (id: string) => {
    setIsLoading(false);
    setChannelId(id);
  };
  
  const handleTryAgain = () => {
    setIsLoading(false);
    setHasError(false);
    setChannelId(null);
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      {!isLoading && !channelId && !hasError && (
        <ChannelSearchForm 
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      
      {isLoading && !channelId && (
        <div>
          <ChannelSearchForm 
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
          />
          <LoadingState />
        </div>
      )}
      
      {hasError && (
        <div>
          <ChannelSearchForm 
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
          />
          <ErrorState onTryAgain={handleTryAgain} />
        </div>
      )}
      
      {channelId && (
        <div>
          <ChannelSearchForm 
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
          />
          <ChannelResults channelId={channelId} onTryAgain={handleTryAgain} />
        </div>
      )}
    </main>
  );
};

export default Home;
