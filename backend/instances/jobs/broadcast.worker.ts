import { Queue, Worker } from "bullmq";

import { redis } from "@be/modules/redis";
import { logger } from "@be/utils/logger";

const connection = redis

interface JobData {
  fileLink: string | null;
  captionMsg: string;
  fileName: string | null;
}

const queue = new Queue<JobData>("basic-worker", { connection });

// If there is any issue with initializing the queue, stop the bot and exit the process
queue.on("error", (err: any) => {
  if (
    (err.hasOwnProperty("code") && err.code === "ECONNREFUSED") ||
    err.code === "ENOTFOUND"
  ) {
    logger.error("Error connecting to the queue");
    process.exit(1);
  }
});

const worker = new Worker<JobData, number>(
  "basic-worker",
  async (job) => {
    console.log(job.data)
    return 1;
  },
  { connection }
);

worker.on("completed", async (_job, result) => {
  logger.info(`Message sent successfully : ${result}`);
});

worker.on("failed", async (_job, err) => {
  logger.error(`Job failed with error: ${err}`);
});

worker.on("error", (err) => {
  logger.error(`Worker error: ${err}`);
});

export default queue;
