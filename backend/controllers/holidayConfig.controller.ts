import { Request, Response } from 'express';
import { logger } from '@be/utils/logger';
import * as holidayConfigService from '@be/services/holdayConfig.service';

export const getAllHolidays = async (_req: Request, res: Response) => {
    try {
        const holidays = await holidayConfigService.getAllHolidays();
        return res.status(200).json(holidays);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to fetch holidays' });
    }
};

export const getHolidayById = async (req: Request, res: Response) => {
    try {
        const holiday = await holidayConfigService.getHolidayById(req.params.id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        return res.status(200).json(holiday);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to fetch holiday' });
    }
};

export const createHoliday = async (req: Request, res: Response) => {
    try {
        const holiday = await holidayConfigService.createHoliday(req.body);
        return res.status(201).json({ message: 'Holiday created successfully', holiday });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to create holiday' });
    }
};

export const updateHoliday = async (req: Request, res: Response) => {
    try {
        const updatedHoliday = await holidayConfigService.updateHoliday(req.params.id, req.body);
        if (!updatedHoliday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        return res.status(200).json({ message: 'Holiday updated successfully', updatedHoliday });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to update holiday' });
    }
};

export const deleteHoliday = async (req: Request, res: Response) => {
    try {
        const deleted = await holidayConfigService.deleteHoliday(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        return res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to delete holiday' });
    }
};