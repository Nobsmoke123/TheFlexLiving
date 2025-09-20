import { useState } from "react";
import { Search, BarChart3 } from "lucide-react";
import { useReviews } from "../../context/useReview";
import Header from "../common/Header";
import Footer from "../common/Footer";
import PropertyListingCard from "./PropertyListingCard";

const PropertyListings = () => {
  const { properties, loading, error } = useReviews();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [filterBy, setFilterBy] = useState<string>("all");

  const enrichedProperties = properties.map((property) => ({
    ...property,
    price: property.price || "£120",
    priceUnit: property.priceUnit || "night",
    guests: property.guests || 4,
    bedrooms: property.bedrooms || 2,
    bathrooms: property.bathrooms || 1,
    featured:
      property.featured !== undefined ? property.featured : Math.random() > 0.5,
  }));

  const filteredAndSortedProperties = enrichedProperties
    .filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "featured" && property.featured) ||
        (filterBy === "1bed" && property.bedrooms === 1) ||
        (filterBy === "2bed" && property.bedrooms === 2) ||
        (filterBy === "3bed+" && property.bedrooms >= 3);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return parseFloat(`${b.avgRating}`) - parseFloat(`${a.avgRating}`);
        case "price-low":
          return (
            parseInt(a.price.toString().replace("£", "")) -
            parseInt(b.price.toString().replace("£", ""))
          );
        case "price-high":
          return (
            parseInt(b.price.toString().replace("£", "")) -
            parseInt(a.price.toString().replace("£", ""))
          );
        case "rating":
          return parseFloat(`${b.avgRating}`) - parseFloat(`${a.avgRating}`);
        case "reviews":
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ Connection Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please check if the backend server is running
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Stay in London
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our curated collection of premium properties across
            London's most sought-after neighborhoods
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, neighborhoods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Properties</option>
              <option value="featured">Featured Only</option>
              <option value="1bed">1 Bedroom</option>
              <option value="2bed">2 Bedrooms</option>
              <option value="3bed+">3+ Bedrooms</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            <span className="font-medium text-gray-900">
              {filteredAndSortedProperties.length}
            </span>{" "}
            properties found
            {searchTerm && (
              <span>
                {" "}
                for "
                <span className="font-medium text-gray-900">{searchTerm}</span>"
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-2">No properties found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search or filters
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProperties.map((property) => (
              <PropertyListingCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyListings;
