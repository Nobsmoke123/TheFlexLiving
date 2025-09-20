import dotenv from "dotenv";
import { initializeDatabase, db } from "./config/database";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3001;

function startServer() {
  try {
    // Setup database
    initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Flex Living Reviews API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("💾 Database connection closed");
    }
    process.exit(0);
  });
});

startServer();
