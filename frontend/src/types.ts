// TypeScript Interfaces
export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface Review {
  id: string;
  type: string;
  status: string;
  rating: number;
  publicReview: string;
  reviewCategories: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  approved: boolean;
  propertyId: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  type: string;
  avgRating: string | number;
  totalReviews: number;
  approvedReviews: number;
  images: string[];
  price?: string;
  priceUnit?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
}

export interface ReviewFilters {
  channel: string;
  rating: string;
  approved: string;
}

export interface ReviewsContextType {
  reviews: Review[];
  properties: Property[];
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  toggleReviewApproval: (reviewId: string) => Promise<void>;
  getPropertyReviews: (propertyId: string) => Review[];
  getApprovedReviews: (propertyId: string) => Review[];
  refreshReviews: () => Promise<void>;
  loadInitialData: () => Promise<void>;
}
