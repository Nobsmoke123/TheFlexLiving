import { MapPin, Users, Star } from "lucide-react";
import { useReviews } from "../../context/useReview";
import StarRating from "../common/StarRating";
import type { Property } from "../../types";

const PropertyListingCard = ({ property }: { property: Property }) => {
  const { setSelectedProperty, setCurrentView } = useReviews();

  const handleViewProperty = () => {
    setSelectedProperty(property);
    setCurrentView("public");
  };

  return (
    <div
      onClick={handleViewProperty}
      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={property.images[0]}
          alt={`${property.name}-property-image`}
        />
        {property.featured && (
          <div className="absolute top-3 left-3 bg-teal-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">
              {property.name}
            </h3>
            <p className="text-gray-600 text-xs mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {`${property.address.slice(0, 50)}..`}
            </p>
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-3">{property.type}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {property.guests} guests
          </span>
          <span className="flex items-center">🛏️ {property.bedrooms} bed</span>
          <span className="flex items-center">
            🛁 {property.bathrooms} bath
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <StarRating
            rating={parseFloat(`${property.avgRating}`) || 0}
            size="sm"
          />
          <span className="text-sm font-medium text-gray-900">
            {property.avgRating}
          </span>
          <span className="text-xs text-gray-500">
            ({property.approvedReviews} reviews)
          </span>
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-lg font-semibold text-gray-900">
            {property.price}
          </span>
          <span className="text-sm text-gray-600">/{property.priceUnit}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingCard;
