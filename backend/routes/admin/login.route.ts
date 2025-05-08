import express, { Router } from 'express';
import { body } from 'express-validator';

import { adminController } from '@be/controllers';
import { validateRequest } from '@be/middlewares/validateRequest';
import { verifyAdmin } from '@be/middlewares/verifyAdmin';

const router: Router = express.Router();

/**
 * @swagger
 * definitions:
 *   LoginAdmin:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         default: user@mail.com
 *       password:
 *         type: string
 *         default: password
 */

/**
 * @swagger
 * parameters:
 *  User:
 *    
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User management and login
 */

/**
 * @swagger
 * /v1/admins/auth/login:
 *   post:
 *     description: Login to the application for the admin
 *     tags:
 *       - Auth
 *     requestBody:
 *       name: admin
 *       description: Admin data from App initial data when opening webapp.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/LoginAdmin'
 *     responses:
 *       201:
 *         description: login success
 *       400:
 *         description: request error
 *       500:
 *         description: server error
 */
router.post(
    '/login',
    [
        body('email').notEmpty().withMessage('email is required'),
        body('password').notEmpty().withMessage('password is required'),
    ],
    validateRequest,
    adminController.login
);

export default router;
