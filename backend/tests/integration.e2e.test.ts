import request from "supertest";
import app from "../src/app";

describe("Full API Integration", () => {
  describe("Complete Review Management Flow", () => {
    let reviewId: string;

    it("should complete full review management workflow", async () => {
      // Step 1: Check API health
      const healthResponse = await request(app).get("/api/health").expect(200);

      expect(healthResponse.body.success).toBe(true);
      console.log("✅ API Health Check passed");

      // Step 2: Fetch reviews from Hostaway
      const reviewsResponse = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      expect(reviewsResponse.body.success).toBe(true);
      expect(reviewsResponse.body.data.reviews.length).toBeGreaterThan(0);

      // Get a review ID for testing
      reviewId = reviewsResponse.body.data.reviews[0].id;
      console.log(
        `✅ Fetched ${reviewsResponse.body.data.reviews.length} reviews`
      );

      // Step 3: Get properties list
      const propertiesResponse = await request(app)
        .get("/api/properties")
        .expect(200);

      expect(propertiesResponse.body.success).toBe(true);
      expect(propertiesResponse.body.data.length).toBeGreaterThan(0);

      // Step 5: Approve a review
      const approveResponse = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({ approved: true })
        .expect(200);

      expect(approveResponse.body.success).toBe(true);
      expect(approveResponse.body.data.approved).toBe(true);
      console.log(`✅ Approved review ${reviewId}`);

      // Step 6: Disapprove the same review
      const disapproveResponse = await request(app)
        .post(`/api/reviews/${reviewId}/approve`)
        .send({ approved: false })
        .expect(200);

      expect(disapproveResponse.body.success).toBe(true);
      expect(disapproveResponse.body.data.approved).toBe(false);
      console.log(`✅ Disapproved review ${reviewId}`);
    });
  });

  describe("API Response Consistency", () => {
    it("should have consistent response format across all endpoints", async () => {
      const endpoints = [
        "/api/health",
        "/api/properties",
        "/api/reviews/hostaway",
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint).expect(200);

        // All successful responses should have success: true
        expect(response.body).toHaveProperty("success", true);

        // All responses should have data (except health which has specific format)
        if (endpoint !== "/api/health") {
          expect(response.body).toHaveProperty("data");
        }

        console.log(`✅ ${endpoint} has consistent response format`);
      }
    });

    it("should handle concurrent requests properly", async () => {
      // Make multiple concurrent requests to test for race conditions
      const promises = Array.from({ length: 5 }, () =>
        request(app).get("/api/health").expect(200)
      );

      const responses = await Promise.all(promises);

      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.body.success).toBe(true);
        console.log(`✅ Concurrent request ${index + 1} succeeded`);
      });
    });
  });

  describe("Data Validation", () => {
    it("should return valid data types in all responses", async () => {
      // Test properties endpoint
      const propertiesResponse = await request(app)
        .get("/api/properties")
        .expect(200);

      const properties = propertiesResponse.body.data;
      if (properties.length > 0) {
        const property = properties[0];

        // Validate required fields exist and have correct types
        expect(typeof property.id).toBe("string");
        expect(typeof property.name).toBe("string");
        expect(typeof property.address).toBe("string");
        expect(typeof property.avgRating).toBe("string");
        expect(typeof property.totalReviews).toBe("number");
        expect(typeof property.approvedReviews).toBe("number");
        expect(Array.isArray(property.images)).toBe(true);

        console.log("✅ Properties endpoint returns valid data types");
      }

      // Test reviews endpoint
      const reviewsResponse = await request(app)
        .get("/api/reviews/hostaway")
        .expect(200);

      const reviewsData = reviewsResponse.body.data;
      expect(Array.isArray(reviewsData.reviews)).toBe(true);
      expect(Array.isArray(reviewsData.properties)).toBe(true);
      expect(typeof reviewsData.metadata).toBe("object");

      console.log("✅ Reviews endpoint returns valid data types");
    });
  });
});
