import { Admin, IAdmin } from '@be/schema/admin';

export const authenticateAdmin = async (email: string, password: string) => {
    try {
        let admin = await Admin.findOne({ email }, ['+password']);

        if (!admin) {
            throw new Error("Admin not found");
        }

        if (admin.isBlocked) {
            throw new Error("Admin access is blocked");
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) throw new Error('Wrong email or password');

        return { 
            success: true, 
            token: admin.generateToken(),
            refreshToken: admin.generateRefreshToken(),
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

export const getAdminById = async (id: string, option?: any) => {
    return await Admin.findById(id, option);
};

export const getAllAdmins = async (
    paginationOptions: { skip: number; limit: number; sort: any },
    search?: string,
) => {
    const query: any = { role: 'admin' };

    if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const admins = await Admin.find(query)
        .skip(paginationOptions.skip)
        .limit(paginationOptions.limit)
        .sort(paginationOptions.sort);
    
    const totalCount = await Admin.countDocuments(query);

    return {
        items: admins,
        totalCount,
        currentData: admins.length,
        totalPages: Math.ceil(totalCount / (paginationOptions.limit || 10)),
    };
};

export const createAdmin = async (data: Partial<IAdmin>) => {
    const admin = new Admin(data);
    await admin.save();
    return admin;
};

export const updateAdmin = async (id: string, data: Partial<IAdmin> | any) => {
    return await Admin.findByIdAndUpdate(id, data, { new: true });
};