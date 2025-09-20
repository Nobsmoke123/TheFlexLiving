import { useState } from "react";
import { useReviews } from "../../context/useReview";
import ReviewCard from "./ReviewCard";
import FilterBar from "./FilterBar";

const ReviewsManagement = () => {
  const {
    selectedProperty,
    getPropertyReviews,
    setCurrentView,
    loading,
    error,
  } = useReviews();
  const [filters, setFilters] = useState({
    channel: "",
    rating: "",
    approved: "",
  });

  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No property selected</div>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-teal-600 hover:text-teal-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const propertyReviews = getPropertyReviews(selectedProperty.id);

  const filteredReviews = propertyReviews.filter((review) => {
    if (filters.channel && review.channel !== filters.channel) return false;
    if (filters.rating && review.rating < parseInt(filters.rating))
      return false;
    if (
      filters.approved !== "" &&
      review.approved.toString() !== filters.approved
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Connection Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-teal-600 hover:text-teal-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-teal-600 hover:text-teal-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedProperty.name}
          </h1>
          <p className="text-gray-600">Manage reviews for this property</p>
        </div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No reviews found</div>
              <div className="text-sm text-gray-400">
                Try adjusting your filters
              </div>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showApprovalControls={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;
