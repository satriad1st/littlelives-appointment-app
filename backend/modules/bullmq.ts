import { Queue, Worker } from 'bullmq';

import { redis as connection } from './redis';

export const queue = (name: string) => {
  new Queue(name, { connection });
}

export const broadcast = (name: string) => {
  new Worker(name, async (job) => { }, { connection });
}

export const createQueue = (name: string) => {
  return new Queue(name, { connection });
};

export const createWorker = (name: string, processFunction: (job: any) => Promise<void>) => {
  return new Worker(name, processFunction, { connection });
};