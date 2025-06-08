import { z } from "zod";

const googleAuthSchema = z.object({
    access_token: z.string().min(1, "access_token is required"),
});

export type GoogleAuthSchema = z.infer<typeof googleAuthSchema>;

export const validateGoogleAuth = (payload: GoogleAuthSchema) => {
  return googleAuthSchema.parse(payload);
};
