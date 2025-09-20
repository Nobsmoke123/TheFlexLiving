import request from "supertest";
import app from "../src/app";

describe("Error Handling", () => {
  describe("404 Not Found", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/api/non-existent-endpoint")
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Not Found");
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain(
        "GET /api/non-existent-endpoint not found"
      );
    });

    it("should handle POST requests to non-existent routes", async () => {
      const response = await request(app)
        .post("/api/non-existent-endpoint")
        .send({ test: "data" })
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain(
        "POST /api/non-existent-endpoint not found"
      );
    });

    it("should handle PUT requests to non-existent routes", async () => {
      const response = await request(app)
        .put("/api/non-existent-endpoint")
        .send({ test: "data" })
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain(
        "PUT /api/non-existent-endpoint not found"
      );
    });

    it("should handle DELETE requests to non-existent routes", async () => {
      const response = await request(app)
        .delete("/api/non-existent-endpoint")
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain(
        "DELETE /api/non-existent-endpoint not found"
      );
    });
  });

  describe("Malformed JSON", () => {
    it("should handle malformed JSON in request body", async () => {
      await request(app)
        .post("/api/reviews/test-id/approve")
        .set("Content-Type", "application/json")
        .send("{ invalid json }")
        .expect(500); // Your app returns 500 for malformed JSON

      // Express/body-parser handles malformed JSON but your error handler catches it
    });
  });

  describe("Large Request Bodies", () => {
    it("should handle large request bodies within limits", async () => {
      const largeData = {
        approved: true,
        notes: "a".repeat(1000), // 1KB of data
      };

      const response = await request(app)
        .post("/api/reviews/test-id/approve")
        .send(largeData);

      // Should not fail due to body size (within Express default limits)
      expect(response.status).toBeLessThan(500);
    });
  });

  describe("HTTP Methods", () => {
    it("should handle unsupported HTTP methods gracefully", async () => {
      const response = await request(app).patch("/api/health").expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain("PATCH /api/health not found");
    });
  });

  describe("Headers Validation", () => {
    it("should accept requests with proper headers", async () => {
      const response = await request(app)
        .get("/api/health")
        .set("Accept", "application/json")
        .set("User-Agent", "Test Agent/1.0")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should handle requests without Accept header", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("Query Parameters", () => {
    it("should handle requests with query parameters", async () => {
      const response = await request(app)
        .get("/api/properties?sort=name&limit=10")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should handle requests with invalid query parameters", async () => {
      const response = await request(app)
        .get("/api/properties?invalid=test&malformed")
        .expect(200);

      // Should not fail due to query parameters
      expect(response.body).toHaveProperty("success", true);
    });
  });
});
