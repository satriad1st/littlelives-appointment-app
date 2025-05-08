// utils/pagination.ts
import { SortOrder } from 'mongoose';

interface PaginationOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    orderBy?: string | number;
}

export function getPaginationOptions(query: PaginationOptions) {
    const { page = 1, limit = 10, sortBy = 'createdAt', orderBy = '-1' } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const orderByValue = Number(orderBy);

    if (isNaN(orderByValue) || ![1, -1].includes(orderByValue)) {
        throw new Error('Invalid orderBy value. It must be 1 or -1.');
    }

    const sortObject = { [sortBy]: orderByValue } as { [key: string]: SortOrder };

    return {
        skip: limitNumber * (pageNumber - 1),
        limit: limitNumber,
        sort: sortObject
    };
}
