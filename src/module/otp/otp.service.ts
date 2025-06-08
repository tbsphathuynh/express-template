import crypto from "crypto";

import emailService, { EmailTemplate } from "../../config/email";
import QueueConfig from "../../config/queueConfig";
import { OTP_QUEUE_NAME, OTP_TYPE } from "./otp.queue";

interface OtpData {
  otp: string;
  expiresAt: number;
}

interface OtpJobData {
  email: string;
  template: EmailTemplate;
}
const otpQueueConfig = new QueueConfig({
  queueName: OTP_QUEUE_NAME.OTP_EMAIL,
  workerProcessor: async (job) => {
    const { email, template } = job.data as OtpJobData;
    await emailService.sendEmail(
      {
        to: email,
        subject: "Your OTP for Verification",
      },
      template
    );
  },
  workerConcurrency: 5,
});

class OtpService {
  private redisClient = otpQueueConfig.getRedisClient();
  private otpQueue = otpQueueConfig.getQueue();

  private otpEmailRedisKey = (email: string, type: string) =>
    `otp:${email}:${type}`;

  async generateAndSendOtp({
    email,
    templateName,
    type,
  }: {
    email: string;
    templateName: string;
    type: OTP_TYPE;
  }): Promise<void> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const key = this.otpEmailRedisKey(email, type);
    await this.redisClient.set(key, JSON.stringify({ otp, expiresAt }), {
      PX: 5 * 60 * 1000, // Expire in 5 minutes
    });
    const template = {
      name: templateName,
      variables: {
        otp,
      },
    };
    await this.otpQueue.add("send-otp", {
      email,
      otp,
      template,
    });
  }

  async verifyOtp({
    email,
    otp,
    type,
  }: {
    email: string;
    otp: string;
    type: string;
  }): Promise<boolean> {
    const key = this.otpEmailRedisKey(email, type);
    const data = await this.redisClient.get(key);

    if (!data) {
      return false;
    }

    const { otp: storedOtp, expiresAt } = JSON.parse(data) as OtpData;

    if (Date.now() > expiresAt) {
      await this.redisClient.del(key);
      return false;
    }

    if (storedOtp === otp) {
      await this.redisClient.del(key);
      return true;
    }

    return false;
  }
}

export default OtpService;
