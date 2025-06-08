import { z } from "zod";

const updateUserSchema = z.object({
  fullname: z.string().optional(),
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

export const validateUpdateUserPayload = (payload: UpdateUserPayload) => {
  return updateUserSchema.parse(payload);
};
