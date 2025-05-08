import mongoose from "mongoose";

import { logger } from "@be/utils/logger";

const config = {
  format: process.env.MONGO_FORMAT ? process.env.MONGO_FORMAT : "mongodb",
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  db: process.env.MONGO_DB_NAME,
};

const credential = config.user ? `${config.user}:${config.pass}@` : ``;

const mongodbUri = `${config.format}://${credential}${config.host}${config?.port ? `:${config.port}` : ""}/${config.db}`;
export async function connect() {
  await mongoose
    .connect(mongodbUri)
    .then((e) => {
      logger.info(
        `🥭 Mongo DB connected using mongoose v${e.version} to ${config.format}://${config.host}${config?.port ? `:${config.port}` : ""}/${config.db}`
      );
    })
    .catch((err) => {
      logger.error(err);
    });
}
