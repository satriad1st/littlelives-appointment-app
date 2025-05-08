import jwt from 'jsonwebtoken';

export const encodeToken = (payload: any): string => {
    const secret = process.env.JWT_SECRET as string;

    return jwt.sign(payload, secret);
};
