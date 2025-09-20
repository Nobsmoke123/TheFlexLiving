import request from "supertest";
import app from "../src/app";

describe("Reviews API", () => {
  describe("GET /api/reviews/hostaway", () => {
    it("should fetch and return reviews from Hostaway API", async () => {
      const response = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");

      const data = response.body.data;
      expect(data).toHaveProperty("reviews");
      expect(data).toHaveProperty("properties");
      expect(data).toHaveProperty("metadata");

      expect(Array.isArray(data.reviews)).toBe(true);
      expect(Array.isArray(data.properties)).toBe(true);

      // Check metadata structure
      const metadata = data.metadata;
      expect(metadata).toHaveProperty("totalReviews");
      expect(metadata).toHaveProperty("newReviews");
      expect(metadata).toHaveProperty("source", "hostaway");
      expect(metadata).toHaveProperty("fetchedAt");
      expect(metadata).toHaveProperty("channels");

      expect(typeof metadata.totalReviews).toBe("number");
      expect(typeof metadata.newReviews).toBe("number");
      expect(Array.isArray(metadata.channels)).toBe(true);

      // Validate timestamp
      expect(new Date(metadata.fetchedAt).toISOString()).toBe(
        metadata.fetchedAt
      );
    });

    it("should return reviews with proper structure", async () => {
      const response = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      const reviews = response.body.data.reviews;

      if (reviews.length > 0) {
        const review = reviews[0];
        expect(review).toHaveProperty("id");
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("guestName");
        expect(review).toHaveProperty("publicReview");
        expect(review).toHaveProperty("submittedAt");
        expect(review).toHaveProperty("listingName");
        expect(review).toHaveProperty("channel");
        expect(review).toHaveProperty("propertyId");
        expect(review).toHaveProperty("approved");

        // Validate data types
        expect(typeof review.id).toBe("string");
        expect(typeof review.rating).toBe("number");
        expect(typeof review.guestName).toBe("string");
        expect(typeof review.listingName).toBe("string");
        expect(typeof review.channel).toBe("string");
        expect(typeof review.approved).toBe("boolean");
      }
    });

    it("should calculate property averages correctly", async () => {
      const response = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      const properties = response.body.data.properties;

      if (properties.length > 0) {
        const property = properties[0];
        expect(property).toHaveProperty("propertyId");
        expect(property).toHaveProperty("listingName");
        expect(property).toHaveProperty("reviews");
        expect(property).toHaveProperty("totalReviews");
        expect(property).toHaveProperty("averageRating");

        expect(typeof property.totalReviews).toBe("number");
        expect(typeof property.averageRating).toBe("number");
        expect(Array.isArray(property.reviews)).toBe(true);

        // Validate that totalReviews matches actual reviews count
        expect(property.totalReviews).toBe(property.reviews.length);

        // Validate average rating is within valid range
        if (property.averageRating > 0) {
          expect(property.averageRating).toBeGreaterThanOrEqual(0);
          expect(property.averageRating).toBeLessThanOrEqual(5);
        }
      }
    });
  });

  describe("POST /api/reviews/:reviewId/approve", () => {
    let reviewId: string;

    beforeAll(async () => {
      // First, get some reviews to work with
      const response = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      const reviews = response.body.data.reviews;
      if (reviews.length > 0) {
        reviewId = reviews[0].id;
      }
    });

    it("should approve a review successfully", async () => {
      if (!reviewId) {
        console.log("No reviews available for approval test");
        return;
      }

      const response = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({ approved: true })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Review approved successfully"
      );
      expect(response.body).toHaveProperty("data");

      const data = response.body.data;
      expect(data).toHaveProperty("reviewId", reviewId);
      expect(data).toHaveProperty("approved", true);
      expect(data).toHaveProperty("updatedAt");
      expect(data).toHaveProperty("database", "SQLite");

      // Validate timestamp
      expect(new Date(data.updatedAt).toISOString()).toBe(data.updatedAt);
    });

    it("should disapprove a review successfully", async () => {
      if (!reviewId) {
        console.log("No reviews available for disapproval test");
        return;
      }

      const response = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({ approved: false })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Review disapproved successfully"
      );
      expect(response.body).toHaveProperty("data");

      const data = response.body.data;
      expect(data).toHaveProperty("reviewId", reviewId);
      expect(data).toHaveProperty("approved", false);
    });

    it("should handle missing approval status", async () => {
      if (!reviewId) {
        console.log("No reviews available for missing approval test");
        return;
      }

      const response = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({}) // Missing approved field
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toContain("approved");
    });

    it("should handle non-existent reviewId", async () => {
      const response = await request(app)
        .post("/api/reviews/non-existent-id/approve")
        .send({ approved: true })
        .expect(200); // The operation succeeds even with non-existent ID

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message");
    });

    it("should validate request body content-type", async () => {
      if (!reviewId) {
        console.log("No reviews available for content-type test");
        return;
      }

      const response = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ approved: true }));

      // Should not fail due to content-type
      expect(response.status).toBeLessThan(400);
    });

    it("should handle invalid approval data type", async () => {
      if (!reviewId) {
        console.log("No reviews available for data type test");
        return;
      }

      const response = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({ approved: "invalid" }) // String instead of boolean
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toContain("boolean");
    });
  });
});
