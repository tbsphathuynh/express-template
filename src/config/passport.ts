import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleTokenStrategy } from "passport-google-token";
import { Request } from "express";
import UserModel from "../module/user/user.schema";
import { PassportStatic } from "passport";
import SessionModel from "../module/auth/session.schema";
import { logger } from "./logger";

interface JwtPayload {
  id: string;
  sessionId: string;
  email: string;
  isEmailVerified: string;
}

interface JwtOpts {
  jwtFromRequest: (req: Request) => string | null;
  secretOrKey: string;
}

const strategyInit = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  const opts: JwtOpts = {
    jwtFromRequest: (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
      }
      if (!token) {
        token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      }
      return token;
    },
    secretOrKey: JWT_SECRET,
  };

  return new JwtStrategy(
    opts,
    async (
      jwt_payload: JwtPayload,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
          // validate session
          const session = await SessionModel.findOne({
            _id: jwt_payload.sessionId,
            userId: user._id,
            isValid: true,
          });
          if (!session) {
            return done(new Error("Session not found"), false);
          }
          // !TODO: need to think for proper way for session id
          // @ts-ignore
          user.sessionId = session._id;
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

// Google Token Strategy
const googleStrategyInit = () => {
  const GOOGLE_CLIENT_IDS = [
    process.env.ANDROID_CLIENT_ID,
    process.env.IOS_CLIENT_ID,
    process.env.WEB_CLIENT_ID,
  ].filter(Boolean) as string[];
  if (!GOOGLE_CLIENT_IDS.length) {
    throw new Error("At least one Google Client ID must be set");
  }

  return new GoogleTokenStrategy(
    { clientID: GOOGLE_CLIENT_IDS },
    async (
      _accessToken: string,
      _refreshToken: string | undefined,
      profile: {
        id: string;
        displayName: string;
        emails?: Array<{ value: string; verified: boolean }>;
      },
      done: (error: any, user?: any) => void
    ) => {
      try {
        console.log({
          profile,
          accessToken: _accessToken,
          refreshToken: _refreshToken,
        });
        const email = profile.emails ? profile.emails[0].value : "";
        if (!email) {
          return done(new Error("No email found"), false);
        }
        const existingUser = await UserModel.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });
        if (existingUser) {
          if (existingUser.email !== email) {
            return done(new Error("Email already exists"), false); // !TODO: need to think for proper message
          }
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        } else {
          const newUser = await UserModel.create({
            googleId: profile.id,
            email: email,
            fullname: profile.displayName,
          });
          return done(null, newUser);
        }
      } catch (error) {
        logger.error({ error });
        return done(error, false);
      }
    }
  );
};

export default (passport: PassportStatic) => {
  passport.use(strategyInit());
  passport.use(googleStrategyInit());
};
