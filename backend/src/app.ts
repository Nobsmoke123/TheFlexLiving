import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(router);

// 404 handler for non-existent routes
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

// Error handling middleware for actual server errors
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: error.message,
  });
});

export default app;
