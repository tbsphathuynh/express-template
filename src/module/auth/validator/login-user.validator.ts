import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginUserPayload = z.infer<typeof loginSchema>;

export const validateLoginUser = (payload: LoginUserPayload) => {
  return loginSchema.parse(payload);
};