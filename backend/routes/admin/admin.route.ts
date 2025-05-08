import express, { Router } from 'express';
import { body, check } from 'express-validator';

import { adminController } from '@be/controllers';
import { validateRequest } from '@be/middlewares/validateRequest';
import { verifyAdmin, verifySuperAdmin } from '@be/middlewares/verifyAdmin';

const router: Router = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Admins
 *       description: Admin management
 */

/**
 * @swagger
 * /v1/admins:
 *   get:
 *     summary: Get all admins with pagination
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (defaults to 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results per page (defaults to 20)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [1, -1]
 *         description: Sorting order (ascending or descending)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalCount:
 *                   type: integer
 *                 currentData:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get(
    '', 
    verifySuperAdmin,
    [
        check('page').optional().default(1).isInt().toInt(),
        check('limit').optional().default(20).isInt().toInt(),
        check('sortBy').optional().isString(),
        check('orderBy').optional().isString().isIn(['1', '-1']),
        check('search').optional().isString(),
    ], 
    adminController.getAllAdmins,
);

/**
 * @swagger
 * /v1/admins:
 *   post:
 *     summary: Create a new admin
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the admin
 *               email:
 *                 type: string
 *                 description: Email of the admin
 *               password:
 *                 type: string
 *                 description: Password for the admin
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
    '',
    verifySuperAdmin,
    [
        body('name').isString().withMessage('Name must be a string'),
        body('email').isString().withMessage('Email must be a string'),
        body('password').isString().withMessage('Password must be a string'),
        body('gender').optional().isIn(['male', 'female', 'other']).default('other').withMessage('Gender must be one of value'),
    ],
    validateRequest,
    adminController.createAdmin
);

/**
 * @swagger
 * /v1/admins/me/reset-password:
 *   patch:
 *     summary: Reset the logged-in admin's password
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: The old password for the admin
 *               new_password:
 *                 type: string
 *                 description: The new password for the admin
 *               confirmation_new_password:
 *                 type: string
 *                 description: The confirmation password for the admin
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
router.patch(
    '/me/reset-password',
    verifyAdmin,
    [
        body('old_password').isString().withMessage('Old Password must be a string'),
        body('new_password').isString().withMessage('New Password must be a string'),
        body('confirmation_new_password').isString().withMessage('Password Confirmation must be a string'),
    ],
    validateRequest,
    adminController.resetPassword
);

/**
 * @swagger
 * /v1/admins/{id}/reset-password:
 *   patch:
 *     summary: Reset an admin's password
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin whose password is being reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_password:
 *                 type: string
 *                 description: The new password for the admin
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
router.patch(
    '/:id/reset-password',
    verifySuperAdmin,
    [
        body('new_password').isString().withMessage('New Password must be a string'),
    ],
    validateRequest,
    adminController.resetPasswordAdmin
);

/**
 * @swagger
 * /v1/admins/me:
 *   patch:
 *     summary: Update the logged-in admin's data
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the admin
 *               email:
 *                 type: string
 *                 description: Email of the admin
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the admin
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.patch(
    '/me', 
    verifyAdmin,
    [
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isString().withMessage('Email must be a string'),
        body('gender').optional().isIn(['male', 'female', 'other']).default('other').withMessage('Gender must be one of value'),
    ],
    validateRequest,
    adminController.updateAdmin
);

/**
 * @swagger
 * /v1/admins/{id}:
 *   patch:
 *     summary: Update an admin
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the admin
 *               email:
 *                 type: string
 *                 description: Email of the admin
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the admin
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
router.patch(
    '/:id',
    verifySuperAdmin,
    [
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isString().withMessage('Email must be a string'),
        body('gender').optional().isIn(['male', 'female', 'other']).default('other').withMessage('Gender must be one of value'),
    ],
    validateRequest,
    adminController.updateAdmin
);

/**
 * @swagger
 * /v1/admins/me:
 *   get:
 *     summary: Get the logged-in admin's data
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved admin data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the admin
 *                 email:
 *                   type: string
 *                   description: Email of the admin
 *                 gender:
 *                   type: string
 *                   enum: [male, female, other]
 *                   description: Gender of the admin
 *       400:
 *         description: Request error
 *       500:
 *         description: Server error
 */
router.get('/me', verifyAdmin, adminController.getMe);

export default router;
