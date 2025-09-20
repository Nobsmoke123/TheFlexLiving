import request from "supertest";
import app from "../src/app";

describe("API Health Check", () => {
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toEqual({
        success: true,
        service: "The Flex Reviews API",
        version: "1.0.0",
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });

      // Validate timestamp is a valid ISO string
      expect(new Date(response.body.timestamp).toISOString()).toBe(
        response.body.timestamp
      );
    });

    it("should return uptime as a positive number", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body.uptime).toBeGreaterThan(0);
    });
  });
});
