import { Request, Response } from 'express';
import { logger } from '@be/utils/logger';
import * as slotConfigService from '@be/services/slotConfig.service';

export const getSlotConfigByWeekday = async (req: Request, res: Response) => {
    try {
        const weekday = parseInt(req.params.weekday);
        if (isNaN(weekday) || weekday < 0 || weekday > 6) {
            return res.status(400).json({ message: 'Invalid weekday parameter' });
        }

        const config = await slotConfigService.getSlotConfigByWeekday(weekday);

        if (!config) {
            return res.status(404).json({ message: 'Slot config not found for this weekday' });
        }

        return res.status(200).json(config);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to fetch slot config' });
    }
};

export const createSlotConfig = async (req: Request, res: Response) => {
    try {
        const slotConfig = await slotConfigService.createSlotConfig(req.body);
        return res.status(201).json({ message: 'Slot config created successfully', slotConfig });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to create slot config' });
    }
};

export const updateSlotConfig = async (req: Request, res: Response) => {
    try {
        const updatedSlotConfig = await slotConfigService.updateSlotConfig(req.params.id, req.body);
        if (!updatedSlotConfig) {
            return res.status(404).json({ message: 'Slot config not found' });
        }
        return res.status(200).json({ message: 'Slot config updated successfully', updatedSlotConfig });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to update slot config' });
    }
};

export const deleteSlotConfig = async (req: Request, res: Response) => {
    try {
        const deleted = await slotConfigService.deleteSlotConfig(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Slot config not found' });
        }
        return res.status(200).json({ message: 'Slot config deleted successfully' });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to delete slot config' });
    }
};