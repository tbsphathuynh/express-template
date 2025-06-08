import express, { Express } from "express";
import http from "http";
import Database from "./config/db";
import passport from "passport";
import passportConfig from "./config/passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import ROUTES from "./route";
import emailService from "./config/email";
import SocketConfig from "./config/socket/socket";
import { applyLogging } from "./config/logger";
const server = () => {
  const app: Express = express();
  const server = http.createServer(app);

  applyLogging(app);

  const db = new Database();
  db.connect();

  new SocketConfig(server, {
    corsOrigin: "http://localhost:3000", // Adjust to your frontend URL
    corsMethods: ["GET", "POST"],
  });

  const corsOptions = {
    origin: "http://localhost:3000", // Ensure this matches your frontend origin
    credentials: true, // Allow credentials (cookies) to be sent and received
    maxAge: 30 * 24 * 60 * 60, // "30 days" in seconds
  };
  app.use(cors(corsOptions));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Setup Morgan for logging
  app.use(morgan("combined"));

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(fileUpload());

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Initialize passport
  app.use(passport.initialize());
  passportConfig(passport);

  // verify SMTP connection
  emailService.verifyConnection();

  // Public route
  app.get("/", (req, res) => {
    res.send("Yes, it's working 🚀");
  });

  // Use other routes
  ROUTES.forEach((route) => {
    app.use(`/api/v1${route.path}`, route.route);
  });

  return { app, server };
};

export default server;
