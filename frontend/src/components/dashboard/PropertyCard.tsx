import { MapPin } from "lucide-react";
import { useReviews } from "../../context/useReview";
import StarRating from "../common/StarRating";
import type { Property } from "../../types";

const PropertyCard = ({ property }: { property: Property }) => {
  const { getPropertyReviews, setCurrentView, setSelectedProperty } =
    useReviews();
  const propertyReviews = getPropertyReviews(property.id);
  const approvedCount = propertyReviews.filter((r) => r.approved).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {property.name}
          </h3>
          <p className="text-gray-600 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {`${property.address.slice(0, 30)}..`}
          </p>
          <p className="text-gray-500 text-sm mt-1">{property.type}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <StarRating rating={parseFloat(`${property.avgRating}`) || 0} />
            <span className="font-semibold text-gray-900">
              {property.avgRating}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {property.totalReviews} reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {property.totalReviews}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {approvedCount}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {property.totalReviews - property.approvedReviews}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => {
            setSelectedProperty(property);
            setCurrentView("reviews");
          }}
          className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          Manage Reviews
        </button>
        <button
          onClick={() => {
            setSelectedProperty(property);
            setCurrentView("public");
          }}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          View Public Page
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
