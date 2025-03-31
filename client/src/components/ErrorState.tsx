interface ErrorStateProps {
  onTryAgain: () => void;
  errorMessage?: string;
}

const ErrorState = ({ onTryAgain, errorMessage = "Channel not found. Please check the channel name or URL and try again." }: ErrorStateProps) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <svg className="w-20 h-20 text-youtube-red mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
      </svg>
      <h3 className="text-xl font-bold mb-2">Channel Not Found</h3>
      <p className="text-youtube-gray mb-6">{errorMessage}</p>
      <button 
        className="px-6 py-3 bg-youtube-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        onClick={onTryAgain}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
