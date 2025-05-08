import express, { Router } from 'express';
import { param, body } from 'express-validator';

import * as holidayConfigController from '@be/controllers/holidayConfig.controller';
import { validateRequest } from '@be/middlewares/validateRequest';
import { verifyAdmin } from '@be/middlewares/verifyAdmin';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: HolidayConfig
 *     description: Holiday configuration management
 */

/**
 * @swagger
 * /v1/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags:
 *       - HolidayConfig
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holidays
 *       500:
 *         description: Server error
 */
router.get('/', holidayConfigController.getAllHolidays);

/**
 * @swagger
 * /v1/holidays/{id}:
 *   get:
 *     summary: Get a holiday by ID
 *     tags:
 *       - HolidayConfig
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
 *         description: Holiday detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  verifyAdmin,
  holidayConfigController.getHolidayById
);

/**
 * @swagger
 * /v1/holidays:
 *   post:
 *     summary: Create a holiday
 *     tags:
 *       - HolidayConfig
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               date:
 *                 type: string
 *                 description: Holiday date (YYYY-MM-DD)
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Holiday created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  [body('date').isISO8601(), body('reason').optional().isString()],
  validateRequest,
  verifyAdmin,
  holidayConfigController.createHoliday
);

/**
 * @swagger
 * /v1/holidays/{id}:
 *   patch:
 *     summary: Update a holiday
 *     tags:
 *       - HolidayConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Holiday updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id',
  [param('id').isMongoId(), body('date').optional().isISO8601(), body('reason').optional().isString()],
  validateRequest,
  verifyAdmin,
  holidayConfigController.updateHoliday
);

/**
 * @swagger
 * /v1/holidays/{id}:
 *   delete:
 *     summary: Delete a holiday
 *     tags:
 *       - HolidayConfig
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
 *         description: Holiday deleted
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
  holidayConfigController.deleteHoliday
);

export default router;