export interface HostawayReview {
  id: number;
  type: "guest-to-host" | "host-to-guest";
  status: "published" | "awaiting";
  rating: null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: string;
  type: string;
  status: string;
  rating: number;
  publicReview: string;
  reviewCategories: Array<{ category: string; rating: number }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  source: string;
  propertyId: string;
  approved: boolean;
}

export interface HostawayProperty {
  id: number;
  name: string;
  internalListingName: string;
  description: string;
  address: string;
  price: number;
  personCapacity: number;
  bedroomsNumber: number;
  bathroomsNumber: number;
  listingImages: Array<{
    url: string;
  }>;
}

export interface Listing {
  id: number;
  name: string;
  internalListingName: string;
  address: string;
  description: string;
  avg_rating: number;
  total_reviews: number;
  approved_reviews: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  reviews: string;
  guests: number;
  images: string;
  createdAt: string;
}
