import express, { Router } from 'express';
import { healthCheckController } from '@be/controllers';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health Check API
 */

/**
 * @swagger
 * /v1/health:
 *   get:
 *     summary: Check the health of backend services
 *     description: Returns the status of MongoDB, Redis, AppBot, DiscordBot, Appointment API and RPC.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Services are running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 Mongo:
 *                   type: string
 *                   example: OK
 *                 Redis:
 *                   type: string
 *                   example: OK
 *                 AppBot:
 *                   type: string
 *                   example: OK
 *                 DiscordBot:
 *                   type: string
 *                   example: OK
 *                 appointmentApi:
 *                   type: string
 *                   example: OK
 *                 RPC:
 *                   type: string
 *                   example: OK
 *       500:
 *         description: Failed to fetch health status
 */
router.get('/', healthCheckController.healthCheck);

export default router;
