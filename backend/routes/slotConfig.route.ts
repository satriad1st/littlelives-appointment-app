import express, { Router } from 'express';
import { param, body } from 'express-validator';

import * as slotConfigController from '@be/controllers/slotConfig.controller';
import { validateRequest } from '@be/middlewares/validateRequest';
import { verifyAdmin } from '@be/middlewares/verifyAdmin';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: SlotConfig
 *     description: Slot configuration management
 */

/**
 * @swagger
 * /v1/slot-configs/weekday/{weekday}:
 *   get:
 *     summary: Get slot configuration by weekday
 *     tags:
 *       - SlotConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weekday
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         description: Weekday number (0=Sunday, ..., 6=Saturday)
 *     responses:
 *       200:
 *         description: Slot configuration for the weekday
 *       400:
 *         description: Invalid weekday
 *       404:
 *         description: Slot configuration not found
 *       500:
 *         description: Server error
 */
router.get(
  '/weekday/:weekday',
  [param('weekday').isInt({ min: 0, max: 6 }).withMessage('Weekday must be between 0-6')],
  verifyAdmin,
  validateRequest,
  slotConfigController.getSlotConfigByWeekday
);

/**
 * @swagger
 * /v1/slot-configs:
 *   post:
 *     summary: Create a slot configuration
 *     tags:
 *       - SlotConfig
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekday
 *               - startTime
 *               - endTime
 *               - slotDurationMinutes
 *             properties:
 *               weekday:
 *                 type: integer
 *                 description: 0=Sunday, ..., 6=Saturday
 *               startTime:
 *                 type: string
 *                 description: Start time (HH:mm)
 *               endTime:
 *                 type: string
 *                 description: End time (HH:mm)
 *               slotDurationMinutes:
 *                 type: integer
 *                 description: Slot duration in minutes
 *               maxBookingPerSlot:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Slot configuration created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  [
    body('weekday').isInt({ min: 0, max: 6 }).withMessage('Weekday must be between 0-6'),
    body('startTime').isString(),
    body('endTime').isString(),
    body('slotDurationMinutes').isInt({ min: 1 }),
    body('maxBookingPerSlot').optional().isInt({ min: 1 }),
  ],
  validateRequest,
  verifyAdmin,
  slotConfigController.createSlotConfig
);

/**
 * @swagger
 * /v1/slot-configs/{id}:
 *   patch:
 *     summary: Update a slot configuration
 *     tags:
 *       - SlotConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekday:
 *                 type: integer
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               slotDurationMinutes:
 *                 type: integer
 *               maxBookingPerSlot:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Slot config updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('weekday').optional().isInt({ min: 0, max: 6 }),
    body('startTime').optional().isString(),
    body('endTime').optional().isString(),
    body('slotDurationMinutes').optional().isInt({ min: 1 }),
    body('maxBookingPerSlot').optional().isInt({ min: 1 }),
  ],
  validateRequest,
  verifyAdmin,
  slotConfigController.updateSlotConfig
);

/**
 * @swagger
 * /v1/slot-configs/{id}:
 *   delete:
 *     summary: Delete a slot configuration
 *     tags:
 *       - SlotConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slot config deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  verifyAdmin,
  slotConfigController.deleteSlotConfig
);

export default router;