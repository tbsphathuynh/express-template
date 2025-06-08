import { z } from "zod";
import { OTP_TYPE } from "../../otp/otp.queue";

const resendOtpSchema = z.object({
  type: z.enum([OTP_TYPE.EMAIL_VERIFICATION, OTP_TYPE.FORGOT_PASSWORD]),
});

export type ResendOptPayload = z.infer<typeof resendOtpSchema>;

export const validateResendOtpPayload = (payload: ResendOptPayload) => {
  return resendOtpSchema.parse(payload);
};
