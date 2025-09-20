const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "theflexliving-backend-production.up.railway.app";

class ApiService {
  async request(
    endpoint: string,
    options: {
      method?: string;
      body?: string;
      headers?: Record<string, string>;
    } = {
      headers: {},
    }
  ) {
    const url = `https://${API_BASE_URL}/api${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Reviews API
  async getHostawayReviews() {
    return this.request("/reviews/hostaway");
  }

  async approveReview(reviewId: string, approved: boolean) {
    return this.request(`/reviews/${reviewId}/approve`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
  }

  // Properties API
  async getProperties() {
    return this.request("/properties");
  }

  // Health Check
  async getHealth() {
    return this.request("/health");
  }
}

export const apiService = new ApiService();
export default apiService;
