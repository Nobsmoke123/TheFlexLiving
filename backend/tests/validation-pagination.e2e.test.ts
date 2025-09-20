import request from "supertest";
import app from "../src/app";

describe("Validation and Pagination API", () => {
  describe("GET /api/properties - Pagination", () => {
    it("should support pagination parameters", async () => {
      const response = await request(app)
        .get("/api/properties?page=1&limit=2")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");

      const pagination = response.body.pagination;
      expect(pagination).toHaveProperty("currentPage", 1);
      expect(pagination).toHaveProperty("itemsPerPage", 2);
      expect(pagination).toHaveProperty("totalItems");
      expect(pagination).toHaveProperty("totalPages");
      expect(pagination).toHaveProperty("hasNextPage");
      expect(pagination).toHaveProperty("hasPreviousPage");

      // Should return at most 2 items since limit=2
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it("should support sorting", async () => {
      const response = await request(app)
        .get("/api/properties?sort=name&order=desc")
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.length > 1) {
        // Check if sorted in descending order by name
        for (let i = 1; i < response.body.data.length; i++) {
          expect(
            response.body.data[i].name <= response.body.data[i - 1].name
          ).toBe(true);
        }
      }
    });

    it("should support filtering by minimum rating", async () => {
      const response = await request(app)
        .get("/api/properties?minRating=4")
        .expect(200);

      expect(response.body.success).toBe(true);
      // All returned properties should have rating >= 4
      response.body.data.forEach((property: any) => {
        expect(parseFloat(property.avgRating)).toBeGreaterThanOrEqual(4);
      });
    });

    it("should return default pagination when no parameters provided", async () => {
      const response = await request(app).get("/api/properties").expect(200);

      expect(response.body).toHaveProperty("pagination");
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10); // default limit
    });
  });

  describe("GET /api/reviews - Pagination and Validation", () => {
    it("should support pagination for reviews", async () => {
      const response = await request(app)
        .get("/api/reviews?page=1&limit=5")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");

      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it("should filter reviews by approval status", async () => {
      const response = await request(app)
        .get("/api/reviews?approved=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      // All returned reviews should be approved
      response.body.data.forEach((review: any) => {
        expect(review.approved).toBe(true);
      });
    });

    it("should sort reviews by rating", async () => {
      const response = await request(app)
        .get("/api/reviews?sort=rating&order=desc")
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.length > 1) {
        // Check if sorted in descending order by rating
        for (let i = 1; i < response.body.data.length; i++) {
          expect(
            response.body.data[i].rating <= response.body.data[i - 1].rating
          ).toBe(true);
        }
      }
    });

    it("should filter reviews by minimum rating", async () => {
      const response = await request(app)
        .get("/api/reviews?minRating=4")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((review: any) => {
        expect(review.rating).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe("Validation Errors", () => {
    it("should validate review approval body", async () => {
      const response = await request(app)
        .post("/api/reviews/test-id/approve")
        .send({ invalid: "field" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid request body");
      expect(response.body.message).toContain("approved");
    });

    it("should validate review ID parameter", async () => {
      const response = await request(app)
        .post("/api/reviews/ /approve") // Invalid ID with space
        .send({ approved: true })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid parameters");
    });

    it("should reject invalid boolean for approved field", async () => {
      const response = await request(app)
        .post("/api/reviews/test-id/approve")
        .send({ approved: "yes" }) // Should be boolean
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("boolean");
    });
  });

  describe("Advanced Filtering", () => {
    it("should filter properties by bedrooms", async () => {
      const response = await request(app)
        .get("/api/properties?bedrooms=2")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((property: any) => {
        expect(property.bedrooms).toBe(2);
      });
    });

    it("should filter properties by maximum price", async () => {
      const response = await request(app)
        .get("/api/properties?maxPrice=200")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((property: any) => {
        expect(property.price).toBeLessThanOrEqual(200);
      });
    });

    it("should filter properties by minimum guest capacity", async () => {
      const response = await request(app)
        .get("/api/properties?guests=4")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((property: any) => {
        expect(property.guests).toBeGreaterThanOrEqual(4);
      });
    });
  });
});
