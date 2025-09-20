import { Request, Response } from "express";
import { Property } from "../models/property";

export class PropertyController {
  listProperties = async (req: Request, res: Response) => {
    try {
      // Extract validated query parameters (from validation middleware)
      const {
        page = 1,
        limit = 10,
        sort = "name",
        order = "asc",
        minRating,
        maxPrice,
        bedrooms,
        bathrooms,
        guests,
      } = (req as any).validatedQuery || req.query;

      const result = await Property.getAllWithStats({
        page: Number(page),
        limit: Number(limit),
        sort: String(sort),
        order: order as "asc" | "desc",
        minRating: minRating ? Number(minRating) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        guests: guests ? Number(guests) : undefined,
      });

      res.json({
        success: true,
        ...result,
      });

      return;
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch properties",
        message: (error as Error).message,
      });
    }
  };

  findProperty = async (req: Request, res: Response) => {
    try {
      const { propertyId } = req.params;

      const property = await Property.getPropertyDetails(propertyId);

      res.json({
        success: true,
        data: property,
      });

      return;
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch property",
        message: (error as Error).message,
      });
    }
  };

  healthCheck = async (_req: Request, res: Response) => {
    res.json({
      success: true,
      service: "The Flex Reviews API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}
