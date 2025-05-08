import { SlotConfig, ISlotConfig } from '@be/schema/slotConfig';
import { redis } from '@be/modules/redis';

const slotConfigCacheKey = (weekday: number) => `slot_config_${weekday}`;

export const getSlotConfigByWeekday = async (weekday: number) => {
    const cached = await redis.get(slotConfigCacheKey(weekday));
    if (cached) {
        return JSON.parse(cached);
    }

    const config = await SlotConfig.findOne({ weekday });
    if (config) {
        await redis.set(slotConfigCacheKey(weekday), JSON.stringify(config), 'EX', 3600); // 1 hour
    }
    return config;
};

export const createSlotConfig = async (data: Partial<ISlotConfig>) => {
    const updatedSlotConfig = await SlotConfig.findOneAndUpdate(
        { weekday: data.weekday },
        data,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await redis.del(slotConfigCacheKey(data.weekday!));
    return updatedSlotConfig;
};

export const updateSlotConfig = async (id: string, data: Partial<ISlotConfig>) => {
    const updated = await SlotConfig.findByIdAndUpdate(id, data, { new: true });
    if (updated) {
        await redis.del(slotConfigCacheKey(updated.weekday));
    }
    return updated;
};

export const deleteSlotConfig = async (id: string) => {
    const deleted = await SlotConfig.findByIdAndDelete(id);
    if (deleted) {
        await redis.del(slotConfigCacheKey(deleted.weekday));
    }
    return deleted;
};