interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

const FullScreenLoader = ({
  isLoading,
  message = "Processing...",
}: FullScreenLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-asceta-blue border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Message */}
          <p className="text-gray-700 font-medium text-center">{message}</p>
          <p className="text-gray-500 text-sm text-center mt-2">
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
