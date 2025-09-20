import Joi from "joi";

/**
 * Validation schemas for API endpoints
 */
export const validationSchemas = {
  // Query parameters for pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string()
      .valid("name", "rating", "reviews", "price", "created_at")
      .default("name"),
    order: Joi.string().valid("asc", "desc").default("asc"),
  }),

  // Property query parameters
  propertyQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string()
      .valid("name", "rating", "reviews", "price")
      .default("name"),
    order: Joi.string().valid("asc", "desc").default("asc"),
    minRating: Joi.number().min(0).max(5),
    maxPrice: Joi.number().positive(),
    bedrooms: Joi.number().integer().min(0),
    bathrooms: Joi.number().min(0),
    guests: Joi.number().integer().min(1),
  }),

  // Review query parameters
  reviewQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string()
      .valid("rating", "submittedAt", "guestName")
      .default("submittedAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
    approved: Joi.boolean(),
    minRating: Joi.number().min(0).max(5),
    propertyId: Joi.string(),
  }),

  // Property ID parameter
  propertyId: Joi.object({
    propertyId: Joi.string()
      .required()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\-_]+$/),
  }),

  // Review ID parameter
  reviewId: Joi.object({
    reviewId: Joi.string()
      .required()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\-_]+$/),
  }),

  // Review approval body
  reviewApproval: Joi.object({
    approved: Joi.boolean().required(),
  }),
};

/**
 * Middleware to validate request parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid parameters",
        message: error.details[0].message,
        details: error.details,
      });
    }

    req.params = value;
    next();
  };
};

/**
 * Middleware to validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        message: error.details[0].message,
        details: error.details,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Middleware to validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        message: error.details[0].message,
        details: error.details,
      });
    }

    // Store validated values in a separate property instead of overwriting req.query
    req.validatedQuery = value;
    next();
  };
};
