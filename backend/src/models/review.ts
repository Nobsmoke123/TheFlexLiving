import { NormalizedReview } from "../utils/types";
import { db } from "../config/database";
import {
  PaginationOptions,
  PaginatedResult,
  getPaginationSQL,
  getOrderSQL,
} from "../utils/pagination";

export interface ReviewFilters {
  approved?: boolean;
  minRating?: number;
  propertyId?: string;
}

export class Review {
  static save = async (review: NormalizedReview) => {
    const savedReview = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO reviews 
        (id, propertyId, type, guestName, rating, publicReview, reviewCategories, submittedAt, channel, approved)
        VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        [
          review.id,
          review.propertyId,
          review.type,
          review.guestName,
          review.rating,
          review.publicReview,
          JSON.stringify(review.reviewCategories),
          review.submittedAt,
          review.channel,
          review.approved ? 1 : 0,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );

      stmt.finalize();
    });

    return savedReview;
  };

  static getAll = async () => {
    const reviews = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT r.*, p.name as listing_name
        FROM reviews r
        LEFT JOIN properties p ON r.propertyId = p.id
        ORDER BY r.submittedAt DESC
      `,
        (
          err: Error,
          rows: {
            id: string;
            listing_name: string;
            type: string;
            status: string;
            rating: number;
            publicReview: string;
            reviewCategories: Array<{ category: string; rating: number }>;
            submittedAt: string;
            guestName: string;
            listingName: string;
            channel: string;
            source: string;
            propertyId: string;
            approved: boolean;
          }[]
        ) => {
          if (err) reject(err);
          else {
            const reviews = rows.map((row) => ({
              id: row.id,
              type: "guest-to-host",
              status: "published",
              rating: row.rating,
              publicReview: row.publicReview,
              reviewCategories: JSON.parse(`${row.reviewCategories}` || "[]"),
              submittedAt: row.submittedAt,
              guestName: row.guestName,
              listingName: row.listing_name,
              channel: row.channel,
              approved: Boolean(row.approved), // Convert to boolean
              propertyId: row.propertyId,
            }));
            resolve(reviews);
          }
        }
      );
    });

    return reviews as NormalizedReview[];
  };

  static getAllPaginated = async (
    options: PaginationOptions & ReviewFilters = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<NormalizedReview>> => {
    const {
      page,
      limit,
      sort = "submittedAt",
      order = "desc",
      approved,
      minRating,
      propertyId,
    } = options;

    // Build WHERE clause for filters
    const filters: string[] = [];
    const params: any[] = [];

    if (approved !== undefined) {
      filters.push("r.approved = ?");
      params.push(approved ? 1 : 0);
    }

    if (minRating !== undefined) {
      filters.push("r.rating >= ?");
      params.push(minRating);
    }

    if (propertyId !== undefined) {
      filters.push("r.propertyId = ?");
      params.push(propertyId);
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    // Generate ORDER BY clause
    const orderByClause = getOrderSQL(sort, order, "reviews");

    // Get total count first
    const totalCount = await new Promise<number>((resolve, reject) => {
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reviews r
        LEFT JOIN properties p ON r.propertyId = p.id
        ${whereClause}
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

    const reviews = await new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, p.name as listing_name
        FROM reviews r
        LEFT JOIN properties p ON r.propertyId = p.id
        ${whereClause}
        ${orderByClause}
        ${paginationSQL.sql}
      `;

      db.all(query, params, (err: Error, rows: any[]) => {
        if (err) reject(err);
        else {
          const reviews = rows.map((row) => ({
            id: row.id,
            type: "guest-to-host",
            status: "published",
            rating: row.rating,
            publicReview: row.publicReview,
            reviewCategories: JSON.parse(`${row.reviewCategories}` || "[]"),
            submittedAt: row.submittedAt,
            guestName: row.guestName,
            listingName: row.listing_name,
            channel: row.channel,
            approved: Boolean(row.approved),
            propertyId: row.propertyId,
          }));
          resolve(reviews);
        }
      });
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: reviews as NormalizedReview[],
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

  static updateApproval = async (reviewId: string, approved: boolean) => {
    const result = await new Promise((resolve, reject) => {
      db.run(
        "UPDATE Reviews SET approved = ? WHERE id = ?",
        [approved ? 1 : 0, reviewId],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    return result;
  };
}
