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

export interface ICafeMenuOption {
    drinkTemperature: DrinkTemperature;
    id: number;
    available: boolean;
    price: number;
    deposit: number;
    description: string | null;
    imageFileName: string | null;
    imageUrl: string | null;
}

export interface ICartInfo {
    id: string;
    cafeLocation: string; // Assuming Company is a string or update as necessary
    title: string;
    description?: string;
    createdAt: string;
    expiresAt: string;
    createdById: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface IAddCartMenuPayload {
    cafeMenuId: number;
    isPersonalCup: boolean;
    quantity: number;
    imageUrl: string;
}

export interface IUserInfo {
    uuid: string;
    userName: string;
}

export interface IAddMenuCartParams {
    cafeCartId: string;
    cartData: IAddCartMenuPayload;
    user: IUserInfo;
}

export interface IAddCartItem {
    id: string;
    cafeCartId: string;
    cafeMenuId: number;
    isPersonalCup: boolean;
    quantity: number;
    imageUrl: string;
    createdAt: string;
    createdById: string;
    createdByName: string;
}

export interface IAddCartMenuResponse {
    success: boolean;
    meta: PaginationType;
    data: {
        cafeCartItem: Array<IAddCartItem>;
    };
}
export interface ICafeMenuPopoverProps {
    open: boolean;
    onClose(): void;
    popoverProps: {
        menuName: string;
        options: Array<ICafeMenuOption>;
        price?: number;
    };
    width: number;
    cartId?: string;
    onSuccess(): void;
}

export interface TemperatureBadgeProps {
    temperature: 'ICED' | 'HOT';
}

export interface IDeleteCartItem {
    cafeCartId: string;
    user: IUserInfo;
}

export interface CafeCartItem {
    cafeCartId: string;
    cafeMenuId: number;
    createdAt: string;
    createdById: string;
    createdByName: string;
    drinkCategory: string;
    drinkImageFilename: string;
    drinkImageUrl: string;
    drinkName: string;
    drinkPrice: number;
    drinkTemperature: 'HOT' | 'ICED';
    drinkTotalPrice: number;
    id: string;
    imageUrl: string;
    isPersonalCup: boolean;
    quantity: number;
}

export interface GroupedCafeData {
    [key: string]: {
        cafeMenuId: number;
        drinkName: string;
        drinkImageUrl: string;
        drinkTemperature: 'HOT' | 'ICED';
        totalQuantity: number;
        totalPrice: number;
        items: CafeCartItem[];
    };
}
