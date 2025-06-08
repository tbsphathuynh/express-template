import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string().min(1),
});

export type RegisterUserPayload = z.infer<typeof registerSchema>;

export const validateRegisterUser = (payload: RegisterUserPayload) => {
  return registerSchema.parse(payload);
};