import { Filter } from "lucide-react";
import type { ReviewFilters } from "../../types";

const FilterBar = ({
  filters,
  onFilterChange,
}: {
  filters: ReviewFilters;
  onFilterChange: (filters: ReviewFilters) => void;
}) => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        <select
          value={filters.channel}
          onChange={(e) =>
            onFilterChange({ ...filters, channel: e.target.value })
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Channels</option>
          <option value="Airbnb">Airbnb</option>
          <option value="Booking.com">Booking.com</option>
          <option value="Direct Booking">Direct Booking</option>
          <option value="Expedia">Expedia</option>
          <option value="Hostaway">Hostaway</option>
        </select>

        <select
          value={filters.rating}
          onChange={(e) =>
            onFilterChange({ ...filters, rating: e.target.value })
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        <select
          value={filters.approved}
          onChange={(e) =>
            onFilterChange({ ...filters, approved: e.target.value })
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Reviews</option>
          <option value="true">Approved Only</option>
          <option value="false">Pending Only</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
