import { Model } from "mongoose";
import { UserDocument } from "../user/user.schema";
import jwt from "jsonwebtoken";
import {
  RegisterUserPayload,
  validateRegisterUser,
  LoginUserPayload,
} from "./validator";
import SessionModel, { SessionDocument } from "./session.schema";
import UserService from "../user/user.service";
import OtpService from "../otp/otp.service";
import { OTP_TYPE } from "../otp/otp.queue";

class AuthService {
  private sessionModel: Model<SessionDocument>;

  private readonly otpService: OtpService;
  private readonly userService: UserService;

  constructor() {
    this.sessionModel = SessionModel;
    this.userService = new UserService();
    this.otpService = new OtpService();
  }

  private async createSession({
    userId,
  }: {
    userId: string;
  }): Promise<SessionDocument> {
    const session = {
      userId,
    };
    return await this.sessionModel.create(session);
  }

  async sendEmailVerificationOtp({ email }: { email: string }) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      await this.otpService.generateAndSendOtp({
        email: email,
        templateName: "verify-email-via-otp",
        type: OTP_TYPE.EMAIL_VERIFICATION,
      });
    }
  }

  async sendPasswordResetOtp({ email }: { email: string }) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      await this.otpService.generateAndSendOtp({
        email: email,
        templateName: "reset-password-via-otp",
        type: OTP_TYPE.FORGOT_PASSWORD,
      });
    }
  }

  async generateToken(user: UserDocument): Promise<string> {
    const session = await this.createSession({ userId: user._id.toString() });
    const payload = {
      id: user._id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      sessionId: session._id.toString(),
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const expiresIn = "30d";
    return jwt.sign(payload, secret, { expiresIn });
  }

  async registerUser(
    payload: RegisterUserPayload
  ): Promise<{ user: UserDocument }> {
    validateRegisterUser(payload);
    const user = await this.userService.getUserByEmail(payload.email);

    if (!user) {
      throw new Error("User already exists");
    }

    const newUser = await this.userService.createUser(payload);

    return {
      user: newUser,
    };
  }

  async loginUser({
    email,
    password,
  }: LoginUserPayload): Promise<string | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    // token generation
    const token = await this.generateToken(user);
    return token;
  }

  async logoutUser(sessionId: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate(
      { _id: sessionId },
      { isValid: false, logoutTime: new Date() }
    );
  }

  async verifyEmail(email: string, otp: string): Promise<Boolean | string> {
    const isValid = await this.otpService.verifyOtp({
      email,
      otp,
      type: "email-verification",
    });
    if (!isValid) {
      return false;
    }
    const user = await this.userService.updateUser(
      { email },
      { isEmailVerified: true }
    );

    if (user) {
      const token = await this.generateToken(user);
      return token;
    } else {
      return false;
    }
  }

  async updatePasswordWithOtp(
    email: string,
    newPassword: string,
    otp: string
  ): Promise<Boolean> {
    const isValid = await this.otpService.verifyOtp({
      email,
      otp,
      type: "forgot-password",
    });
    if (!isValid) {
      return false;
    }
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    user.password = newPassword;
    await user.save();
    return true;
  }
}

export default AuthService;
