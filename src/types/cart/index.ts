import { Company, DrinkTemperature } from '@/types/common';

export interface PaginationType {
    totalItems?: number;
    totalPages?: number;
    pageSize?: number;
    currentPage?: number;
    timestamp?: string;
}

export interface INewCartType {
    cafeLocation: Company;
    title: string;
    description?: string;
}

export interface ICreateCartResponse {
    success: boolean;
    meta: PaginationType;
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

export interface ICafeMenuResponse {
    success: boolean;
    meta: PaginationType;
    data: Array<ICafeMenuBoardResponse>;
}

export interface ICafeMenuBoardResponse {
    cafeLocation: Company;
    name: string;
    category: string;
    options: Array<ICafeMenuOption>;
}

interface ICafeMenuOption {
    drinkTemperature: DrinkTemperature;
    id: number;
    available: boolean;
    price: number;
    deposit: number;
    description: string | null;
    imageFileName: string | null;
    imageUrl: string | null;
}
