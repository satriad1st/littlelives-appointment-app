import { HolidayConfig, IHolidayConfig } from '@be/schema/holidayConfig';
import { redis } from '@be/modules/redis';

const cacheKey = 'holidays_config';

export const getAllHolidays = async () => {
    const cached = await redis.get(cacheKey);
    if (cached) {
        return { items: JSON.parse(cached) };
    }

    const holidays = await HolidayConfig.find();
    const duration = 60 * 60; // 1 hour

    await redis.set(cacheKey, JSON.stringify(holidays), 'EX', duration);

    return { items: holidays };
};

export const getHolidayById = async (id: string) => {
    return await HolidayConfig.findById(id);
};

export const createHoliday = async (data: Partial<IHolidayConfig>) => {
    const holiday = new HolidayConfig(data);
    await holiday.save();
    await redis.del(cacheKey); // invalidate cache
    return holiday;
};

export const updateHoliday = async (id: string, data: Partial<IHolidayConfig>) => {
    const updated = await HolidayConfig.findByIdAndUpdate(id, data, { new: true });
    if (updated) {
        await redis.del(cacheKey); // invalidate cache
    }
    return updated;
};

export const deleteHoliday = async (id: string) => {
    const deleted = await HolidayConfig.findByIdAndDelete(id);
    if (deleted) {
        await redis.del(cacheKey); // invalidate cache
    }
    return deleted;
};