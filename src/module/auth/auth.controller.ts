import { Request, Response } from "express";
import AuthService from "./auth.service";
import { formatResponse } from "../../config/responseFormatter";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { OTP_TYPE } from "../otp/otp.queue";
import { logger } from "../../config/logger";

class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  registerUser = async (req: Request, res: Response) => {
    try {
      const { user } = await this.authService.registerUser(req.body);
      await this.authService.sendEmailVerificationOtp({
        email: req.body.email,
      });
      res
        .status(201)
        .json(formatResponse(true, "User registered successfully", { user }));
    } catch (error: any) {
      logger.error("registerUser", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const token = await this.authService.loginUser(req.body);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res
        .status(200)
        .json(formatResponse(true, "Login successfully", { token }));
    } catch (error: any) {
      logger.error("loginUser", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  loginWithGoogle = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { user } = req;
    // create session
    const token = await this.authService.generateToken(user);

    if (req.headers["x-client-type"] === "web") {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      return res.json(formatResponse(true, "Login successfully", { token }));
    }

    res.json(formatResponse(true, "Login successfully", { token }));
  };

  logoutUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { sessionId } = req.user;
      await this.authService.logoutUser(sessionId);
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json(formatResponse(true, "Logout successfully"));
    } catch (error: any) {
      logger.error("logoutUser", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  verifyEmailVerificationOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const isValid = await this.authService.verifyEmail(email, otp);

      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(false, "Invalid OTP", { isValid }));
      }
      res.cookie("token", isValid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res
        .status(200)
        .json(formatResponse(true, "Email verification successfully"));
    } catch (error: any) {
      logger.error("verifyEmailVerificationOtp", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  resendEmailVerificationOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const { type } = req.query;
      switch (type) {
        case OTP_TYPE.EMAIL_VERIFICATION:
          await this.authService.sendEmailVerificationOtp({
            email,
          });
          break;
        case OTP_TYPE.FORGOT_PASSWORD:
          await this.authService.sendPasswordResetOtp({
            email,
          });
          break;
        default:
          return res
            .status(400)
            .json(formatResponse(false, "Invalid OTP type"));
      }

      res.status(200).json(formatResponse(true, "OTP sent to your email", {}));
    } catch (error: any) {
      logger.error("resendEmailVerificationOtp", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  forgotPasswordViaEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await this.authService.sendPasswordResetOtp({
        email,
      });
      res.status(200).json(formatResponse(true, "OTP sent to your email", {}));
    } catch (error: any) {
      logger.error("forgotPasswordEmail", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };

  resetPasswordViaEmail = async (req: Request, res: Response) => {
    try {
      const { email, otp, password } = req.body;
      const isValid = await this.authService.updatePasswordWithOtp(
        email,
        password,
        otp
      );
      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(false, "Invalid OTP", { isValid }));
      }
      res
        .status(200)
        .json(formatResponse(true, "Password updated successfully"));
    } catch (error: any) {
      logger.error("updatePasswordWithOtp", error);
      res
        .status(400)
        .json(formatResponse(false, error.message, (error = error)));
    }
  };
}

export default AuthController;
