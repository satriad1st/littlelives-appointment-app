
import mongoose from 'mongoose';

import { AdminSchema } from '@be/schema/admin';
import { hashPassword } from '@be/utils/password';

const Admins = mongoose.model('Admins', AdminSchema);

async function seedAdmins() {
    try {
        const admins = [
            {
                name: "Super Admin",
                dob: new Date(),
                gender: 'other',
                email: 'superadmin@mail.com',
                password: await hashPassword('12345678!@'),
                role: 'superadmin',
                isBlocked: false,
            },
        ];

        for (const admin of admins) {
            const existing = await  Admins.findOne({ email: admin.email });
            if(!existing){
                const data = new Admins(admin);
                await data.save();
            }
        }

        console.log('Admins have been seeded successfully.');
    } catch (error) {
        console.error('Failed to seed admins:', error);
        throw error;
    }
}

export default seedAdmins;
