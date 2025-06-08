import { logger } from "./src/config/logger";
import server from "./src/server";
import dotenv from "dotenv";

dotenv.config();

const { app, server: httpServer } = server();

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Global error handler
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});