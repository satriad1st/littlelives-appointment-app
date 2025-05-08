import { createServer } from "http";
import { parse } from "url";

import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import next from "next";

import { startApp } from "@be/instances";
import { swaggerOptions, swaggerRouter } from "@be/modules/swagger";
import routes from "@be/routes/index.route";
import { logger } from "@be/utils/logger";
import { initializeSocket } from "@be/socket";

const port = parseInt(process.env.WEBAPP_PORT || "3000", 10);

const isDevEnv = process.env.NODE_ENV !== "production";
const isDevApp = process.env.APP_ENV !== "production";
const app = next({ dev: isDevEnv });
const handle = app.getRequestHandler();
const apiRoutePrefix = "/api";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.prepare().then(() => {
  startApp();
  const server = express();
  // sanitize request data
  server.use(mongoSanitize());

  // gzip compression
  server.use(compression());

  // parse JSON bodies
  server.use(express.json());

  // enable cors
  server.use(cors(corsOptions));
  server.options("*", cors(corsOptions));

  // set security HTTP headers
  server.use(apiRoutePrefix, helmet());

  // v1 api routes
  server.use(`${apiRoutePrefix}/v1`, routes);

  // Swagger Api Documentation
  if (isDevApp) server.use(`${apiRoutePrefix}/docs`, swaggerRouter, swaggerOptions);

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url!, true);
    return handle(req, res, parsedUrl);
  });

  const httpServer = createServer(server);

  initializeSocket(httpServer);

  httpServer.listen(port, (err?: any) => {
    if (err) throw err;
    logger.info(
      `💻 WebApp  listening at http://localhost:${port} with ${isDevApp ? "development" : process.env.APP_ENV} mode app, on ${isDevEnv ? "development" : process.env.NODE_ENV} Env`
    );
    logger.info(
      `🔨 Backend With WebSocket listening at http://localhost:${port}${apiRoutePrefix} with ${isDevApp ? "development" : process.env.APP_ENV} mode server, on ${isDevEnv ? "development" : process.env.NODE_ENV} Env`
    );
    if (isDevApp) {
      logger.info(
        `📝 Read API documentation at http://localhost:${port}${apiRoutePrefix}/docs or ${process.env.TELEGRAM_WEB_APP_URL}${apiRoutePrefix}/docs`
      );
    }
  });

});
