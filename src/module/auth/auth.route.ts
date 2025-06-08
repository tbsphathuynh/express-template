import { Router } from "express";
import AuthController from "./auth.controller";
import { validateRegisterUser } from "./validator";
import { validateLoginUser } from "./validator/login-user.validator";
import {
  validateBody,
  validateQuery,
} from "../../middleware/validation.middleware";
import routeCreator, { HttpMethods, IRoutes } from "../../config/routeCreator";
import {
  authenticateGoogle,
  authenticateJWT,
} from "../../middleware/auth.middleware";
import { validateGoogleAuth } from "./validator/login-with-google.validator";
import { validateEmailPayload } from "./validator/verify-email.validator";
import { validateResendOtpPayload } from "./validator/resend-otp.validator";

const authRoutes = Router();
const authController = new AuthController();

const routes: IRoutes[] = [
  {
    path: "/register",
    method: HttpMethods.post,
    middleware: [validateBody(validateRegisterUser)],
    handler: authController.registerUser,
  },
  {
    path: "/login",
    method: HttpMethods.post,
    middleware: [validateBody(validateLoginUser)],
    handler: authController.loginUser,
  },
  {
    path: "/google",
    method: HttpMethods.post,
    middleware: [validateBody(validateGoogleAuth), authenticateGoogle],
    handler: authController.loginWithGoogle,
  },
  {
    path: "/logout",
    method: HttpMethods.put,
    middleware: [authenticateJWT],
    handler: authController.logoutUser,
  },
  {
    path: "/verify-email",
    method: HttpMethods.post,
    middleware: [validateBody(validateEmailPayload)],
    handler: authController.verifyEmailVerificationOtp,
  },
  {
    path: "/resend-email-verification",
    method: HttpMethods.post,
    middleware: [validateBody(validateEmailPayload)],
    handler: authController.resendEmailVerificationOtp,
  },
  {
    path: "/forgot-password",
    method: HttpMethods.post,
    middleware: [
      validateQuery(validateResendOtpPayload),
      validateBody(validateEmailPayload),
    ],
    handler: authController.forgotPasswordViaEmail,
  },
  {
    path: "/reset-password",
    method: HttpMethods.post,
    middleware: [validateBody(validateEmailPayload)],
    handler: authController.resetPasswordViaEmail,
  },
];
routeCreator(authRoutes, routes);
export default authRoutes;
