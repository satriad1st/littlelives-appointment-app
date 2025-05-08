import IORedis from 'ioredis';

export const redis = new IORedis({
  port: process.env.REDIS_PORT as unknown as number,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
  maxRetriesPerRequest: null
});
