import PropertyListings from "./components/listings/PropertyListings";
import { ReviewsProvider } from "./context/ReviewContext";
import { useReviews } from "./context/useReview";
import Dashboard from "./components/dashboard/Dashboard";
import ReviewsManagement from "./components/reviews/ReviewsManagement";
import PublicPropertyPage from "./components/property/PublicPropertyPage";

const AppContent = () => {
  const { currentView, error } = useReviews();

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-600 mb-4 text-xl">
            ⚠️ API Connection Error
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="text-sm text-gray-600 mb-4">
            Please make sure the backend server is running:
          </div>
          <code className="bg-gray-100 p-2 rounded text-xs block mb-4">
            cd backend && npm run dev
          </code>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case "reviews":
      return <ReviewsManagement />;
    case "public":
      return <PublicPropertyPage />;
    case "dashboard":
      return <Dashboard />;
    case "listings":
    default:
      return <PropertyListings />;
  }
};

const App = () => {
  return (
    <ReviewsProvider>
      <div className="min-h-screen bg-gray-50">
        <AppContent />
      </div>
    </ReviewsProvider>
  );
};

export default App;
