import { Application, Request } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import morgan from "morgan";
import DailyRotateFile from "winston-daily-rotate-file";

const isDevelopment = process.env.NODE_ENV !== "production";
const consoleFormat = isDevelopment
  ? winston.format.combine(winston.format.colorize(), winston.format.simple())
  : winston.format.simple();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // Keep logs for 14 days
      zippedArchive: true, // Compress older logs
    }),
    // Rotate error logs daily, keep for 30 days
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d", // Keep error logs for 30 days
      zippedArchive: true,
    }),
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

morgan.token("redacted-headers", (req: Request) => {
  const headers = { ...req.headers };
  if (headers.authorization) {
    headers.authorization = "[REDACTED]";
  }
  return JSON.stringify(headers);
});

const morganMiddleware = morgan(
  ":method :url :status :response-time ms - :redacted-headers",
  {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }
);

const requestLoggerMiddleware = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  expressFormat: true,
  colorize: false,
  requestFilter: (req: Request, propName: string) => {
    if (propName === "query" || propName === "body") {
      const data = { ...req[propName] };
      if (data.password) data.password = "[REDACTED]";
      if (data.token) data.token = "[REDACTED]";
      return data;
    }
    // @ts-ignore
    return req[propName];
  },
});

const errorLoggerMiddleware = expressWinston.errorLogger({
  winstonInstance: logger,
  msg: "HTTP {{req.method}} {{req.url}} - {{err.message}}",
  meta: true,
});

// Global error handlers
process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

const applyLogging = (app: Application) => {
  app.use(morganMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(errorLoggerMiddleware);
};

export { logger, applyLogging };
