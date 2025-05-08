import mongoose, { Schema, Document } from 'mongoose';

export interface IHolidayConfig extends Document {
    date: string; // format "YYYY-MM-DD"
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const HolidayConfigSchema: Schema = new Schema(
    {
        date: { type: String, required: true }, 
        reason: { type: String, default: '' },
    },
    {
        timestamps: true,
        collection: 'holiday_configs',
    }
);

export const HolidayConfig = mongoose.model<IHolidayConfig>('HolidayConfig', HolidayConfigSchema);