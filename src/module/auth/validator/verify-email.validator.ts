import { z } from "zod";

const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.number(),
});

export type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;

export const validateEmailPayload = (payload: VerifyEmailPayload) => {
  return verifyEmailSchema.parse(payload);
};
