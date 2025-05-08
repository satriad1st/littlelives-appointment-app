import { Appointment, IAppointment } from '@be/schema/appointment';
import { SlotConfig } from '@be/schema/slotConfig';
import { HolidayConfig } from '@be/schema/holidayConfig';
import { redis } from '@be/modules/redis';

const slotAvailabilityCacheKey = (date: string) => `available_slots_${date}`;

export const getAppointmentsByDate = async (date: string) => {
    const cached = await redis.get(`appointments_${date}`);
    if (cached) {
        return JSON.parse(cached);
    }

    const appointments = await Appointment.find({ date });
    const duration = 60 * 60; // cache 1 hour
    await redis.set(`appointments_${date}`, JSON.stringify(appointments), 'EX', duration);
    return appointments;
};

export const getAppointmentById = async (id: string) => {
    return await Appointment.findById(id);
};

export const createAppointment = async (data: Partial<IAppointment>) => {
    try {
        const isHoliday = await HolidayConfig.findOne({ date: data.date });
        if (isHoliday) {
            throw new Error('Selected date is a holiday');
        }
        const weekday = new Date(data.date!).getDay();
        const slotConfig = await SlotConfig.findOne({ weekday });

        if (!slotConfig) {
            throw new Error('No slot configuration found for this day');
        }

        // Validate time inside slotConfig operating hours
        if (data.time! < slotConfig.startTime || data.time! >= slotConfig.endTime) {
            throw new Error('Booking time is outside operating hours');
        }

        const toMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const requestedStart = toMinutes(data.time!);
        const requestedEnd = requestedStart + slotConfig.slotDurationMinutes;

        // Validate overlapping with existing appointments
        const existingAppointments = await Appointment.find({
            date: data.date,
            status: { $in: ['pending', 'confirmed'] },
        });

        for (const appointment of existingAppointments) {
            const existingStart = toMinutes(appointment.time);
            const existingEnd = existingStart + slotConfig.slotDurationMinutes;

            const isOverlap = requestedStart < existingEnd && existingStart < requestedEnd;
            
            if (isOverlap) {
                throw new Error('Time slot overlaps with existing appointment');
            }
        }

        const appointment = new Appointment(data);
        await appointment.save();

        // Invalidate cache
        await redis.del(slotAvailabilityCacheKey(data.date!));
        await redis.del(`appointments_${data.date!}`);

        return { success: true, appointment };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

export const cancelAppointment = async (id: string) => {
    const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { new: true }
    );

    if (appointment) {
        // Invalidate cache availability & appointment for this date
        await redis.del(slotAvailabilityCacheKey(appointment.date));
        await redis.del(`appointments_${appointment.date}`);
    }

    return appointment;
};