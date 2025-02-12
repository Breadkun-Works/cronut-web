import { Company } from '@/types/common';

export interface INewCartType {
    cafeLocation: Company;
    title: string;
    description?: string;
}

export interface ICreateCartResponse {
    success: boolean;
    meta: {
        totalItems: number;
        timestamp: string;
    };
    data: {
        cafeCart: {
            id: string;
            cafeLocation: string;
            title: string;
            description: string;
            createdAt: string;
            expiresAt: string;
            createdById: string;
            status: string;
        };
    };
}
