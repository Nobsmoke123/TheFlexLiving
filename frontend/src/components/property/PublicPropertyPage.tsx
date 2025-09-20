import { Calendar, Users } from "lucide-react";
import { useReviews } from "../../context/useReview";
import Header from "../common/Header";
import Footer from "../common/Footer";
import StarRating from "../common/StarRating";

const PublicPropertyPage = () => {
  const { selectedProperty, getApprovedReviews, loading, error } = useReviews();

  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Property not found</div>
            <button
              onClick={() => (window.location.href = "/")}
              className="text-teal-600 hover:text-teal-800"
            >
              ← Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const approvedReviews = getApprovedReviews(selectedProperty.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ Connection Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-2 h-96 mb-6">
          <div className="col-span-2 row-span-2 bg-gray-200 rounded-l-lg flex items-center justify-center">
            <img
              src={selectedProperty.images[0]}
              alt={`${selectedProperty.name}-main-image`}
              className="w-full h-full object-contain"
            />
          </div>

          {selectedProperty.images.length > 1 ? (
            selectedProperty.images.slice(1, 5).map((img, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={img}
                  alt={`${selectedProperty.name}-image-${index + 2}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))
          ) : (
            <>
              <div className="bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">Image 2</span>
              </div>
              <div className="bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">Image 3</span>
              </div>
              <div className="bg-gray-100 rounded-r-lg flex items-center justify-center relative">
                <span className="text-xs text-gray-400">
                  +12 View all photos
                </span>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-8 mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {selectedProperty.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {selectedProperty.guests || 4} Guests
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-1">🛏️</span>
                    {selectedProperty.bedrooms || 2} Bedroom
                    {(selectedProperty.bedrooms || 2) !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-1">🛁</span>
                    {selectedProperty.bathrooms || 1} Bathroom
                    {(selectedProperty.bathrooms || 1) !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-1">📶</span>
                    WiFi
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About this property
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedProperty.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>📶</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🍳</span>
                    <span>Kitchen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🧺</span>
                    <span>Washing Machine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span>Heating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🚭</span>
                    <span>No Smoking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🅿️</span>
                    <span>Parking Available</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  House Rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>• Check-in: 3:00 PM</div>
                  <div>• Check-out: 10:00 AM</div>
                  <div>• No smoking</div>
                  <div>• No pets</div>
                  <div>• No parties or events</div>
                  <div>• Security deposit required</div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Guest Reviews
                </h2>

                {approvedReviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 mb-2">
                      No reviews to display yet
                    </div>
                    <div className="text-sm text-gray-400">
                      Reviews will appear here once approved by property
                      managers
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.guestName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium text-gray-900">
                                {review.guestName}
                              </span>
                              <div className="flex items-center space-x-1">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="text-sm text-gray-600">
                                  {review.rating}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  review.submittedAt
                                ).toLocaleDateString("en-GB", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {review.publicReview}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 sticky top-6">
                <div className="bg-teal-600 text-white text-center py-3 rounded-md mb-4">
                  <span className="font-medium">Book Your Stay</span>
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Select dates to see prices
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Select dates"
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <select className="flex-1 p-2 border border-gray-300 rounded text-sm">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-md mt-4 font-medium">
                  Check availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicPropertyPage;
