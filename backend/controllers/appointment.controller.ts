import { Request, Response } from 'express';
import { logger } from '@be/utils/logger';
import * as appointmentService from '@be/services/appointment.service';

import { SlotConfig } from "@be/schema/slotConfig";
import { HolidayConfig } from '@be/schema/holidayConfig';

const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

const toTimeStr = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const getAppointmentsByDate = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date query parameter is required" });
        }

        const isHoliday = await HolidayConfig.findOne({ date: date });
        if (isHoliday) {
            return res.status(400).json({ message: "Selected date is a holiday" });
        }
    
        // Get appointments
        const appointments = await appointmentService.getAppointmentsByDate(date as string);
    
        // Get slotConfig based on weekday
        const weekday = new Date(date as string).getDay();
        const slotConfig = await SlotConfig.findOne({ weekday });
    
        if (!slotConfig) {
            return res.status(404).json({ message: "No slot configuration found for this date" });
        }
    
        const duration = slotConfig.slotDurationMinutes;
        const startMin = toMinutes(slotConfig.startTime);
        const endMin = toMinutes(slotConfig.endTime);
    
        // Blocked time ranges from existing appointments
        const blockedRanges: any[] = appointments.map((appt: any) => {
            const start = toMinutes(appt.time);
            const end = start + duration;
            return [start, end];
        });
    
        // Generate available slots
        const availableSlots: { startTime: string; endTime: string }[] = [];
        for (let cursor = startMin; cursor + duration <= endMin; cursor += duration) {
            const slotStart = cursor;
            const slotEnd = cursor + duration;
    
            const isOverlap = blockedRanges.some(
            ([start, end]) => slotStart < end && start < slotEnd
            );
    
            if (!isOverlap) {
            availableSlots.push({
                startTime: toTimeStr(slotStart),
                endTime: toTimeStr(slotEnd),
            });
            }
        }
    
        return res.status(200).json({
            items: appointments,
            availableSlots,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Failed to fetch appointments" });
    }
};

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        return res.status(200).json(appointment);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to fetch appointment' });
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const result = await appointmentService.createAppointment(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(201).json({ message: 'Appointment created successfully', appointment: result.appointment });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to create appointment' });
    }
};

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.cancelAppointment(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or already cancelled' });
        }
        return res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Failed to cancel appointment' });
    }
};