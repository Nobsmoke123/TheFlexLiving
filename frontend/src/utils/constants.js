export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const REVIEW_CHANNELS = [
  "Airbnb",
  "Booking.com",
  "Direct Booking",
  "Expedia",
  "Hostaway",
];

export const PROPERTY_TYPES = [
  "Studio Apartment",
  "1 Bedroom Apartment",
  "2 Bedroom Apartment",
  "3 Bedroom Apartment",
  "Penthouse",
  "Loft Apartment",
  "Victorian House",
];

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
};

export const DEFAULT_PROPERTY_IMAGE = "/images/property-placeholder.jpg";
