import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { redis } from '@be/modules/redis';

async function checkMongo() {
  const mongoState = mongoose.connection.readyState;
  return mongoState === 1 ? 'OK' : 'DOWN';
}

async function checkRedis() {
  try {
    await redis.ping();
    return 'OK';
  } catch (error) {
    console.error('Redis error:', error);
    return 'DOWN';
  }
}


export async function healthCheck(req: Request, res: Response) {
  const [mongoStatus, redisStatus] = await Promise.all([
    checkMongo(),
    checkRedis(),
  ]);

  res.status(200).json({
    code: 200,
    Mongo: mongoStatus,
    Redis: redisStatus,
  });
}
