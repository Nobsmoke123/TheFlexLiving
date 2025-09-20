import { Eye, EyeOff } from "lucide-react";
import { useReviews } from "../../context/useReview";
import StarRating from "../common/StarRating";
import type { Review } from "../../types";

const ReviewCard = ({
  review,
  showApprovalControls = false,
}: {
  review: Review;
  showApprovalControls?: boolean;
}) => {
  const { toggleReviewApproval } = useReviews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      Airbnb: "bg-red-100 text-red-800",
      "Booking.com": "bg-blue-100 text-blue-800",
      "Direct Booking": "bg-green-100 text-green-800",
      Expedia: "bg-yellow-100 text-yellow-800",
      Hostaway: "bg-purple-100 text-purple-800",
    };
    return colors[channel] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className={`bg-white rounded-lg border p-6 ${
        review.approved ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(
                review.channel
              )}`}
            >
              {review.channel}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <StarRating rating={review.rating} />
            <span className="font-medium">{`${review.rating.toFixed(1)}`}</span>
            <span>•</span>
            <span>{formatDate(review.submittedAt)}</span>
          </div>
        </div>

        {showApprovalControls && (
          <button
            onClick={() => toggleReviewApproval(review.id)}
            className={`p-2 rounded-md transition-colors ${
              review.approved
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={review.approved ? "Hide from public" : "Show on public page"}
          >
            {review.approved ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {review.publicReview}
      </p>

      {review.reviewCategories && review.reviewCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {review.reviewCategories.map((category, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-900 capitalize">
                {category.category.replace("_", " ")}
              </div>
              <div className="flex items-center justify-center mt-1">
                <StarRating rating={category.rating} size="sm" />
                <span className="ml-1 text-sm font-medium text-gray-600">
                  {category.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
