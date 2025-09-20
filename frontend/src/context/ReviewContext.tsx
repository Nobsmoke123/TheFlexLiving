import React, { createContext, useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { Property, Review, ReviewsContextType } from "../types";

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const ReviewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [properties, setProperties] = useState<Array<Property>>([]);
  const [currentView, setCurrentView] = useState<string>("listings");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Load reviews and properties from API
      const [reviewsResponse, propertiesResponse] = await Promise.all([
        apiService.getHostawayReviews(),
        apiService.getProperties(),
      ]);

      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data.reviews || []);
      }

      if (propertiesResponse.success) {
        setProperties(propertiesResponse.data || []);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError(
        "Failed to load data. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.getHostawayReviews();
      if (response.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error("Error refreshing reviews:", error);
      setError("Failed to refresh reviews");
    } finally {
      setLoading(false);
    }
  };

  const toggleReviewApproval = async (reviewId: string): Promise<void> => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const newApprovalStatus = !review.approved;

    try {
      const response = await apiService.approveReview(
        reviewId,
        newApprovalStatus
      );

      if (response.success) {
        // Update local state
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? { ...review, approved: newApprovalStatus }
              : review
          )
        );

        console.log(
          `✅ Review ${reviewId} ${
            newApprovalStatus ? "approved" : "disapproved"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating review approval:", error);
      setError("Failed to update review approval");
    }
  };

  const getPropertyReviews = (propertyId: string): Review[] => {
    return reviews.filter((review) => review.propertyId === propertyId);
  };

  const getApprovedReviews = (propertyId: string): Review[] => {
    return reviews.filter(
      (review) => review.propertyId === propertyId && review.approved
    );
  };

  const value: ReviewsContextType = {
    reviews,
    properties,
    currentView,
    setCurrentView,
    selectedProperty,
    setSelectedProperty,
    loading,
    error,
    setError,
    toggleReviewApproval,
    getPropertyReviews,
    getApprovedReviews,
    refreshReviews,
    loadInitialData,
  };

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
};

export { ReviewsProvider, ReviewsContext };
