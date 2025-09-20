import { useState } from "react";
import { Search, Star } from "lucide-react";
import { useReviews } from "../../context/useReview";
import PropertyCard from "./PropertyCard";

const Dashboard = () => {
  const { properties, reviews, loading, error, setCurrentView } = useReviews();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((r) => r.approved).length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
          <p className="text-sm text-gray-500">
            Make sure the backend server is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => setCurrentView("listings")}
            className="text-teal-600 hover:text-teal-800"
          >
            ← Back to Listings
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and monitor guest reviews across all properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {properties.length}
            </div>
            <div className="text-gray-600">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {totalReviews}
            </div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {approvedReviews}
            </div>
            <div className="text-gray-600">Approved Reviews</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-yellow-600">
                {avgRating.toFixed(1)}
              </span>
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No properties found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
