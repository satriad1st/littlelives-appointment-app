import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    name: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export const AppointmentSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: '' },
        date: { type: String, required: true }, 
        time: { type: String, required: true }, 
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        collection: 'appointments',
    }
);

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);