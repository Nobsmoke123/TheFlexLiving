import axios from "axios";
import mockHostawayReviews from "./../data/mock-review-data.json";
import { HostawayReview } from "../utils/types";
import { AxiosError } from "axios";

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://api.hostaway.com/v1";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const normalizeHostawayReview = (review: HostawayReview) => {
  let overallRating = review.rating ?? 0;
  if (!overallRating && review.reviewCategory) {
    const avgRating =
      review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0) /
      review.reviewCategory.length;
    overallRating = avgRating / 2;
  }

  return {
    id: review.id.toString(),
    type: review.type,
    status: review.status,
    rating: overallRating,
    publicReview: review.publicReview,
    reviewCategories: review.reviewCategory
      ? review.reviewCategory.map((cat) => ({
          category: cat.category,
          rating: cat.rating / 2,
        }))
      : [],
    submittedAt: new Date(review.submittedAt).toISOString(),
    guestName: review.guestName,
    listingName: review.listingName,
    channel: "Hostaway",
    source: "hostaway",
    propertyId: "",
    approved: false,
  };
};

export const fetchReviews = async () => {
  let hostawayReviews: HostawayReview[] = [];

  try {
    const response = await axios.get(`${BASE_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.result) {
      hostawayReviews = response.data.result;
      console.log(
        `✅ Fetched ${hostawayReviews.length} reviews from Hostaway API`
      );
    }
  } catch (error) {
    console.log("⚠️ Hostaway API returned no data or error, using mock data");

    if (error instanceof AxiosError) {
      console.log(
        "API Error:",
        error.response?.status,
        error.response?.statusText
      );
    }
  }

  if (hostawayReviews.length === 0) {
    hostawayReviews = mockHostawayReviews as HostawayReview[];
    console.log(`📝 Using ${hostawayReviews.length} mock reviews`);
  }

  return hostawayReviews.map(normalizeHostawayReview);
};
