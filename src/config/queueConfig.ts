import { Queue, Worker, QueueOptions, ConnectionOptions } from "bullmq";
import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

interface QueueConfigOptions {
  redisUrl?: string;
  redisHost?: string;
  redisPort?: number;
  redisPassword?: string;
  redisTls?: boolean;
  queueName: string;
  workerProcessor?: (job: any) => Promise<void>;
  workerConcurrency?: number;
}

class QueueConfig {
  private redisClient: RedisClientType;
  private queue: Queue;
  private worker?: Worker;

  constructor(options: QueueConfigOptions) {
    const redisHost = options.redisHost || process.env.REDIS_HOST;
    if (!redisHost) {
      throw new Error("Either redisUrl or redisHost must be provided");
    }
    if (!options.queueName) {
      throw new Error("queueName is required");
    }

    const redisOptions: ConnectionOptions = {
      host: redisHost || "localhost",
      port: options.redisPort || parseInt(process.env.REDIS_PORT || "6379"),
      password: options.redisPassword || process.env.REDIS_PASSWORD,
      tls: options.redisTls
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    };
    this.redisClient = createClient({
      socket: {
        host: redisOptions.host,
        port: redisOptions.port,
      },
    });

    this.redisClient.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    this.redisClient.on("connect", () => {
      logger.info("Connected to Redis");
    });

    this.redisClient.connect().catch((err) => {
      logger.error("Failed to connect to Redis:", err);
    });

    const queueOptions: QueueOptions = {
      connection: redisOptions,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      },
    };

    this.queue = new Queue(options.queueName, queueOptions);

    if (options.workerProcessor) {
      this.worker = new Worker(options.queueName, options.workerProcessor, {
        connection: redisOptions,
        concurrency: options.workerConcurrency || 1,
      });

      this.worker.on("completed", (job) => {
        logger.info(`Job ${job.id} completed in queue ${options.queueName}`);
      });

      this.worker.on("failed", (job, err) => {
        logger.error(
          `Job ${job?.id} failed in queue ${options.queueName}:`,
          err
        );
      });
    }
  }

  getRedisClient(): RedisClientType {
    return this.redisClient;
  }

  getQueue(): Queue {
    return this.queue;
  }

  async close(): Promise<void> {
    await this.queue.close();
    if (this.worker) {
      await this.worker.close();
    }
    await this.redisClient.quit();
  }
}

export default QueueConfig;
