/**
 * Pagination interface
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Pagination result interface
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
  totalItems: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage,
    hasPreviousPage,
  };
};

/**
 * Generate SQL LIMIT and OFFSET clause
 */
export const getPaginationSQL = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return {
    limit,
    offset,
    sql: `LIMIT ${limit} OFFSET ${offset}`,
  };
};

/**
 * Generate SQL ORDER BY clause
 */
export const getOrderSQL = (
  sort?: string,
  order: "asc" | "desc" = "asc",
  context: "properties" | "reviews" = "properties"
) => {
  if (!sort) return "";

  // Validate sort column to prevent SQL injection
  const allowedSortColumns = {
    properties: {
      name: "p.name",
      rating: "avg_rating",
      reviews: "total_reviews",
      price: "p.price",
      created_at: "p.created_at",
    },
    reviews: {
      rating: "r.rating",
      submittedAt: "r.submittedAt",
      guestName: "r.guestName",
    },
  };

  const column =
    allowedSortColumns[context][
      sort as keyof (typeof allowedSortColumns)[typeof context]
    ];
  if (!column) return "";

  return `ORDER BY ${column} ${order.toUpperCase()}`;
};

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
  success: boolean = true
): { success: boolean; data: T[]; pagination: any } => {
  return {
    success,
    data,
    pagination: calculatePagination(totalItems, page, limit),
  };
};
