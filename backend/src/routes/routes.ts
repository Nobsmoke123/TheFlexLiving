import { Router } from "express";
import { PropertyController } from "../controllers/propertyController";
import { ReviewController } from "../controllers/reviewsController";
import {
  validationSchemas,
  validateParams,
  validateBody,
} from "../utils/validation";

const router = Router();
const propertyController = new PropertyController();
const reviewController = new ReviewController();

/**
 * GET /api/properties
 * Returns property information derived from reviews with pagination and filtering
 */
router.get("/api/properties", propertyController.listProperties);

/**
 * GET /api/reviews
 * Returns reviews with pagination and filtering
 */
router.get("/api/reviews", reviewController.getReviews);

/**
 * GET /api/reviews/hostaway
 * Fetches and normalizes reviews from Hostaway API
 */
router.get("/api/reviews/hostaway", reviewController.getHostawayReviews);

/**
 * POST /api/reviews/:reviewId/approve
 * Approve/disapprove a review for public display
 */
router.post(
  "/api/reviews/:reviewId/approve",
  validateParams(validationSchemas.reviewId),
  validateBody(validationSchemas.reviewApproval),
  reviewController.approveReview
);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/api/health", propertyController.healthCheck);

export default router;
