import { Server as SocketServer, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server as HttpServer } from "http";
import { SocketEvents } from "./constants";
import { ConnectionOptions } from "bullmq";

interface SocketConfigOptions {
  corsOrigin: string;
  corsMethods: string[];
  redisTls?: boolean;
}

class SocketConfig {
  private io: SocketServer;

  constructor(httpServer: HttpServer, options: SocketConfigOptions) {
    // Initialize Socket.IO
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: options.corsOrigin,
        methods: options.corsMethods,
      },
    });

    const redisOptions: ConnectionOptions = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      tls: options.redisTls
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    };
    const pubClient = createClient({
      socket: {
        host: redisOptions.host,
        port: redisOptions.port,
      },
    });
    const subClient = pubClient.duplicate();
    this.io.adapter(createAdapter(pubClient, subClient));

    this.io.on(SocketEvents.CONNECTION, (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // example
      socket.on(SocketEvents.JOIN_ROOM, (room: string) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      socket.on(SocketEvents.DISCONNECT, () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Getter for Socket.IO instance
  getIo(): SocketServer {
    return this.io;
  }
}

export default SocketConfig;
