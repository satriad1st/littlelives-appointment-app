import { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import { logger } from "@be/utils/logger";

let io: IOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
    io = new IOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });


    io.on("connection", async (socket: Socket) => {

        logger.info(`👤 New client connected without userId: ${socket.id}`);


        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });

    });

    return io;
};

export { io };
