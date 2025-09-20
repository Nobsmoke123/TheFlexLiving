import { db } from "../config/database";
import { Listing } from "../utils/types";
import {
  PaginationOptions,
  PaginatedResult,
  getPaginationSQL,
  getOrderSQL,
} from "../utils/pagination";

export interface PropertyFilters {
  minRating?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
}

export class Property {
  static getAllWithStats = async (
    options: PaginationOptions & PropertyFilters = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<any>> => {
    const {
      page,
      limit,
      sort = "name",
      order = "asc",
      minRating,
      maxPrice,
      bedrooms,
      bathrooms,
      guests,
    } = options;

    // Build WHERE clause for filters
    const filters: string[] = [];
    const params: any[] = [];

    if (minRating !== undefined) {
      filters.push("avg_rating >= ?");
      params.push(minRating);
    }

    if (maxPrice !== undefined) {
      filters.push("p.price <= ?");
      params.push(maxPrice);
    }

    if (bedrooms !== undefined) {
      filters.push("p.bedrooms = ?");
      params.push(bedrooms);
    }

    if (bathrooms !== undefined) {
      filters.push("p.bathrooms = ?");
      params.push(bathrooms);
    }

    if (guests !== undefined) {
      filters.push("p.guests >= ?");
      params.push(guests);
    }

    const whereClause =
      filters.length > 0 ? `HAVING ${filters.join(" AND ")}` : "";

    // Generate ORDER BY clause
    const orderByClause = getOrderSQL(sort, order, "properties");

    // Get total count first
    const totalCount = await new Promise<number>((resolve, reject) => {
      const countQuery = `
        SELECT COUNT(*) as total
        FROM (
          SELECT 
            p.id,
            COALESCE((AVG(CASE WHEN r.rating > 0 THEN r.rating END)),0) as avg_rating
          FROM properties p
          LEFT JOIN reviews r ON p.id = r.propertyId
          GROUP BY p.id
          ${whereClause}
        ) counted
      `;

      db.get(countQuery, params, (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row.total);
      });
    });

    // Get paginated data
    const paginationSQL = getPaginationSQL(page, limit);

    const properties = await new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*,
          COUNT(r.id) as total_reviews,
          COUNT(CASE WHEN r.approved = 1 THEN 1 END) as approved_reviews,
          COALESCE((AVG(CASE WHEN r.rating > 0 THEN r.rating END)),0) as avg_rating
        FROM properties p
        LEFT JOIN reviews r ON p.id = r.propertyId
        GROUP BY p.id
        ${whereClause}
        ${orderByClause}
        ${paginationSQL.sql}
      `;

      db.all(query, params, (err, rows: Listing[]) => {
        if (err) {
          reject(err);
          return;
        }

        const properties = rows.map((row) => ({
          id: row.id,
          name: row.name,
          address: row.address,
          description: row.description,
          internalListingName: row.internalListingName,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          guests: row.guests,
          price: row.price,
          images: JSON.parse(row.images),
          avgRating: parseFloat(`${row.avg_rating}`).toFixed(1),
          totalReviews: row.total_reviews,
          approvedReviews: row.approved_reviews,
        }));

        resolve(properties);
      });
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: properties as any[],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  };

  static getPropertyDetails = async (propertyId: string) => {
    const property = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
        p.*,
        COUNT(r.id) AS total_reviews,
        COALESCE(AVG(CASE WHEN r.rating > 0 THEN r.rating END), 0) AS avg_rating,
        COALESCE(
        json_group_array(
          CASE WHEN r.id IS NOT NULL THEN
            json_object(
              'id', r.id,
              'rating', r.rating,
              'guestName', r.guestName,
              'publicReview', r.publicReview,
              'submittedAt', r.submittedAt
            )
          END
        ), '[]')
         AS reviews
        FROM properties p
        LEFT JOIN reviews r ON p.id = r.propertyId AND r.approved = 1
        WHERE p.id = ?
        GROUP BY p.id
      `,
        [propertyId],
        (err, row: Listing) => {
          if (err) {
            reject(err);
          } else if (!row) {
            // Property not found, return null instead of trying to parse undefined
            resolve(null);
          } else {
            try {
              const reviews = JSON.parse(row.reviews);
              // Filter out null reviews that might come from LEFT JOIN
              const validReviews = reviews.filter(
                (review: any) => review && review.id
              );
              resolve({ ...row, reviews: validReviews });
            } catch (parseError) {
              resolve({ ...row, reviews: [] });
            }
          }
        }
      );
    });
    return property;
  };

  static getPropertyId = async (listingName: string): Promise<string> => {
    const propertyId = await new Promise((resolve, reject) => {
      db.get(
        `
        SELECT id 
        FROM Properties 
        WHERE internalListingName = ?
      `,
        [listingName],
        (err, row: Listing) => {
          if (err) {
            reject(err);
          } else {
            resolve(row?.id);
          }
        }
      );
    });
    return propertyId as string;
  };
}
