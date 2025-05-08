import { Request, Response } from 'express';
import * as adminService from '@be/services/admin.service';
import { logger } from '@be/utils/logger';
import { getPaginationOptions } from '@be/utils/pagination';
import { hashPassword } from '@be/utils/password';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await adminService.authenticateAdmin(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.status(200).json({ token: result.token, refreshToken: result.refreshToken });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: error });
    }
};

export const getMe = async (req: Request | any, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                code: 400,
                message: 'User not found.'
            });
        }
    
        return res.json({
            code: 200,
            message: 'User info',
            data: req?.user
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const paginationOptions = getPaginationOptions(req.query);
        const collectionsData = await adminService.getAllAdmins(paginationOptions, search as string);

        return res.status(200).json({
            ...collectionsData,
            currentPage: !isNaN(Number(req.query.page)) ? Number(req.query.page) : 1,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to fetch admins' });
    }
};

export const createAdmin = async (req: Request | any, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                code: 400,
                message: 'Authorization failed.'
            });
        }

        if (!req.body.name && req.body.name === "") {
            return res.status(400).json({ message: 'Name must be a string' });
        }

        if (!req.body.email && req.body.email === "") {
            return res.status(400).json({ message: 'Email must be a string' });
        }

        if (!req.body.password && req.body.password === "") {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        if (req.body.gender && req.body.gender === "") {
            req.body.gender = "other"
        }
    
        const payload = {
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            password: await hashPassword(req.body.password),
            role: 'admin' as 'superadmin' | 'admin',
            isBlocked: false,
        }
        const admins = await adminService.createAdmin(payload);

        return res.status(201).json({ message: 'Admin created successfully', admins });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to create admin' });
    }
};

export const updateAdmin = async (req: Request | any, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                code: 400,
                message: 'Authorization failed.'
            });
        }

        if (req.url === "/me") {
            req.params.id = req.user._id;
        }

        const payload: any = {}

        if (req.body.name && req.body.name !== "") {
            payload.name = req.body.name
        }

        if (req.body.email && req.body.email !== "") {
            payload.email = req.body.email
        }

        if (req.body.gender && req.body.gender !== "") {
            payload.gender = req.body.gender
        }

        const admins = await adminService.updateAdmin(req.params.id, payload);

        return res.status(201).json({ message: 'Admin updated successfully', admins });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to update admin' });
    }
};

export const resetPasswordAdmin = async (req: Request | any, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                code: 400,
                message: 'Authorization failed.'
            });
        }

        if (req.body.new_password && req.body.new_password === "") {
            return res.status(400).json({ message: 'Password must be a string' });
        }
        const payload: any = {
            password: await hashPassword(req.body.new_password),
        }
    
        const admins = await adminService.updateAdmin(req.params.id, payload);

        return res.status(201).json({ message: 'Admin updated successfully', admins });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to update admin' });
    }
};

export const resetPassword = async (req: Request | any, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                code: 400,
                message: 'Authorization failed.'
            });
        }

        if (req.body.old_password && req.body.old_password === "") {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        if (req.body.new_password && req.body.new_password === "") {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        if (req.body.confirmation_new_password && req.body.confirmation_new_password === "") {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        if (req.body.new_password !== req.body.confirmation_new_password) {
            return res.status(400).json({ message: 'New Password did not match the confirmation' });
        }

        const admin = await adminService.getAdminById(req.user._id, ['+password']);
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        const isMatch = await admin.comparePassword(req.body.old_password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        const payload: any = {
            password: await hashPassword(req.body.new_password),
        }
    
        const admins = await adminService.updateAdmin(req.user._id, payload);

        return res.status(201).json({ message: 'Admin updated successfully', admins });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to update admin' });
    }
};