import mongoose from "mongoose";
import { logger } from "./logger";

class Database {
  private dbURI: string;

  constructor() {
    this.dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.dbURI);
      logger.info("Database connection successful");
    } catch (error) {
      logger.error("Database connection error:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Database disconnection error:", error);
    }
  }
}

export default Database;
