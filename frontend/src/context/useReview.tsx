import { useContext } from "react";
import { ReviewsContext } from "./ReviewContext";
import type { ReviewsContextType } from "../types";

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within ReviewsProvider");
  }
  return context;
};
