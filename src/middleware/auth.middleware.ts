import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserDocument } from "../module/user/user.schema";

interface AuthUser extends UserDocument {
  sessionId: string;
}
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export const authenticateGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google-token",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        // Handle specific errors from the strategy
        if (err.message === "No email provided by Google") {
          return res
            .status(400)
            .json({ message: "Google account has no email" });
        }
        console.log({ err, user, info });
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Invalid Google token" });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
