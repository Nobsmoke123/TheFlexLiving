import request from "supertest";
import app from "../src/app";

describe("Properties API", () => {
  describe("GET /api/properties", () => {
    it("should return a list of properties with stats", async () => {
      const response = await request(app).get("/api/properties").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);

      // If there are properties, check the structure
      if (response.body.data.length > 0) {
        const property = response.body.data[0];
        expect(property).toHaveProperty("id");
        expect(property).toHaveProperty("name");
        expect(property).toHaveProperty("address");
        expect(property).toHaveProperty("avgRating");
        expect(property).toHaveProperty("totalReviews");
        expect(property).toHaveProperty("approvedReviews");
        expect(property).toHaveProperty("bedrooms");
        expect(property).toHaveProperty("bathrooms");
        expect(property).toHaveProperty("guests");
        expect(property).toHaveProperty("price");
        expect(property).toHaveProperty("images");

        // Validate data types
        expect(typeof property.id).toBe("string");
        expect(typeof property.name).toBe("string");
        expect(typeof property.address).toBe("string");
        expect(typeof property.avgRating).toBe("string");
        expect(typeof property.totalReviews).toBe("number");
        expect(typeof property.approvedReviews).toBe("number");
        expect(Array.isArray(property.images)).toBe(true);
      }
    });

    it("should return properties ordered by name", async () => {
      const response = await request(app).get("/api/properties").expect(200);

      if (response.body.data.length > 1) {
        const properties = response.body.data;
        for (let i = 1; i < properties.length; i++) {
          expect(properties[i].name >= properties[i - 1].name).toBe(true);
        }
      }
    });
  });
});
