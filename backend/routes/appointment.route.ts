import express, { Router } from 'express';
import { param, body, query } from 'express-validator';

import * as appointmentController from '@be/controllers/appointment.controller';
import { validateRequest } from '@be/middlewares/validateRequest';
import { verifyAdmin } from '@be/middlewares/verifyAdmin';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Appointment
 *     description: Appointment management
 */

/**
 * @swagger
 * /v1/appointments:
 *   get:
 *     summary: Get appointments by date
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of appointments
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  [query('date').isISO8601().withMessage('Date is required in YYYY-MM-DD')],
  validateRequest,
  appointmentController.getAppointmentsByDate
);

/**
 * @swagger
 * /v1/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  appointmentController.getAppointmentById
);

/**
 * @swagger
 * /v1/appointments:
 *   post:
 *     summary: Create an appointment
 *     tags:
 *       - Appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, date, time]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 description: HH:mm format
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Validation error or slot full
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  [
    body('name').isString(),
    body('email').isEmail(),
    body('phone').optional().isString(),
    body('date').isISO8601(),
    body('time').isString(),
  ],
  validateRequest,
  appointmentController.createAppointment
);

/**
 * @swagger
 * /v1/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags:
 *       - Appointment
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
 *         description: Appointment cancelled
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/cancel',
  [param('id').isMongoId()],
  validateRequest,
  verifyAdmin,
  appointmentController.cancelAppointment
);

export default router;