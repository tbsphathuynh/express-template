import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { logger } from "./logger";

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
}

export interface EmailTemplate {
  name: string;
  variables: Record<string, string>;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_SECURE = process.env.SMTP_SECURE;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const SMTP_PORT = process.env.SMTP_PORT;

    if (!SMTP_USER || !SMTP_PASS || !SMTP_HOST) {
      throw new Error("SMTP configuration is missing");
    }
    this.transporter = nodemailer.createTransport({
      secure: SMTP_SECURE === "true",
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  verifyConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error("Error verifying SMTP connection:", error);
          reject(error);
        } else {
          logger.info("SMTP connection verified 🚀");
          resolve();
        }
      });
    });
  }

  async sendEmail(
    options: EmailOptions,
    template: EmailTemplate
  ): Promise<void> {
    const FORM_USER = process.env.SMTP_FROM_USER;
    if (!FORM_USER) {
      throw new Error("FROM_USER is not set");
    }

    const templatePath = path.join(
      __dirname,
      "../templates/email",
      `${template.name}.html`
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
    if (!htmlTemplate) {
      throw new Error(`Failed to read template file: ${template.name}`);
    }

    const html = htmlTemplate.replace(
      /{{(\w+)}}/g,
      (_, key) => template.variables[key] || ""
    );

    const mailOptions = {
      from: `${FORM_USER}`,
      to: options.to,
      subject: options.subject,
      html,
      cc: options.cc,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${options.to}`);
    } catch (error) {
      logger.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

const emailService = new EmailService();

export default emailService;
