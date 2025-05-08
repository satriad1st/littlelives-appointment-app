import mongoose, { Schema, Document } from 'mongoose';

export interface ISlotConfig extends Document {
    weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    startTime: string; // format HH:mm
    endTime: string;  // format HH:mm
    slotDurationMinutes: number; // in minute
    maxBookingPerSlot: number;
    createdAt: Date;
    updatedAt: Date;
}

export const SlotConfigSchema: Schema = new Schema(
    {
        weekday: { type: Number, required: true, min: 0, max: 6 },
        startTime: { type: String, required: true }, 
        endTime: { type: String, required: true },  
        slotDurationMinutes: { type: Number, required: true, min: 1 },
        maxBookingPerSlot: { type: Number, default: 1, min: 1 },
    },
    {
        timestamps: true,
        collection: 'slot_configs',
    }
);

export const SlotConfig = mongoose.model<ISlotConfig>('SlotConfig', SlotConfigSchema);