import { Review } from "../models/review";
import { Request, Response } from "express";
import { fetchReviews } from "../services/hostawayService";
import { Property } from "../models/property";

export class ReviewController {
  getReviews = async (req: Request, res: Response) => {
    try {
      // Extract validated query parameters (from validation middleware)
      const {
        page = 1,
        limit = 10,
        sort = "submittedAt",
        order = "desc",
        approved,
        minRating,
        propertyId,
      } = (req as any).validatedQuery || req.query;

      const result = await Review.getAllPaginated({
        page: Number(page),
        limit: Number(limit),
        sort: String(sort),
        order: order as "asc" | "desc",
        approved: approved !== undefined ? Boolean(approved) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        propertyId: propertyId ? String(propertyId) : undefined,
      });

      res.json({
        success: true,
        ...result,
      });

      return;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch reviews",
        message: (error as Error).message,
      });
    }
  };

  getHostawayReviews = async (_req: Request, res: Response) => {
    try {
      console.log("🔄 Fetching reviews from Hostaway API...");

      // Fetch and normalize reviews
      const normalizedReviews = await fetchReviews();

      // Save each review to SQLite
      for (const review of normalizedReviews) {
        try {
          const propertyId = await Property.getPropertyId(review.listingName);
          await Review.save({ ...review, propertyId });
        } catch (error) {
          console.log(
            `⚠️ Error saving review ${review.id}:`,
            (error as Error).message
          );
        }
      }

      // Get all reviews from database
      const allReviews = await Review.getAll();

      // Group by property for insights
      const reviewsByProperty = allReviews.reduce((acc, review) => {
        if (!acc[review.propertyId]) {
          acc[review.propertyId] = {
            propertyId: review.propertyId,
            listingName: review.listingName,
            reviews: [],
            totalReviews: 0,
            averageRating: 0,
          };
        }

        acc[review.propertyId].reviews.push(review);
        acc[review.propertyId].totalReviews++;

        return acc;
      }, {} as Record<string, any>);

      // Calculate averages
      Object.values(reviewsByProperty).forEach((property) => {
        const ratings = property.reviews
          .map((r: { rating: number }) => r.rating)
          .filter((r: number) => r > 0);
        property.averageRating =
          ratings.length > 0
            ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
              ratings.length
            : 0;
      });

      const responseData = {
        success: true,
        data: {
          reviews: allReviews,
          properties: Object.values(reviewsByProperty),
          metadata: {
            totalReviews: allReviews.length,
            newReviews: normalizedReviews.length,
            source: "hostaway",
            fetchedAt: new Date().toISOString(),
            channels: [...new Set(allReviews.map((r) => r.channel))],
          },
        },
      };

      console.log(
        `💾 Stored ${normalizedReviews.length} new reviews in SQLite database`
      );
      res.json(responseData);
    } catch (error) {
      console.error("❌ Error in getHostawayReviews:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch and store reviews",
        message: (error as Error).message,
      });
    }
  };

  approveReview = async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { approved } = req.body;

      // Validation is now handled by middleware, so we can directly use the values
      await Review.updateApproval(reviewId, approved);

      console.log(
        `✅ Review ${reviewId} ${
          approved ? "approved" : "disapproved"
        } in database`
      );

      res.json({
        success: true,
        message: `Review ${approved ? "approved" : "disapproved"} successfully`,
        data: {
          reviewId,
          approved,
          updatedAt: new Date().toISOString(),
          database: "SQLite",
        },
      });
    } catch (error) {
      console.error("❌ Error updating review approval:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update review approval",
        message: (error as Error).message,
      });
    }
  };
}
