import { db } from "../src/config/database";

// Setup test database before all tests
beforeAll(async () => {
  // You can add any global test setup here
  console.log("🧪 Setting up test environment...");
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("✅ Database connection closed");
      }
    });
  }
});

// Clear any test data between tests if needed
afterEach(() => {
  // Reset any mocks or test state
  jest.clearAllMocks();
});
