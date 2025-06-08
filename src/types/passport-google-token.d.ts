declare module "passport-google-token" {
  import { Strategy as PassportStrategy } from "passport";

  interface GoogleTokenStrategyOptions {
    clientID: string | string[];
    clientSecret?: string;
    callbackURL?: boolean;
  }

  interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails?: Array<{
      value: string;
      verified: boolean;
    }>;
    photos?: Array<{
      value: string;
    }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  type VerifyCallback = (error: any, user?: any, info?: any) => void;

  class Strategy extends PassportStrategy {
    constructor(
      options: GoogleTokenStrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string | undefined,
        profile: Profile,
        done: VerifyCallback
      ) => void
    );
  }

  export { Strategy };
}
