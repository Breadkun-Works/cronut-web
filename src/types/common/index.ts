import React, { ReactNode } from 'react';

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
    };
    success: boolean;
}

export const mealMenu = (company: string) => {
    const commonMenu = [
        { value: 'SPECIAL', label: '일품', license: 'Chef' },
        { value: 'KOREAN1', label: '한식', license: 'Bibimbap' },
        { value: 'KOREAN2', label: '라면', license: 'Ramen' },
        { value: 'NOODLE', label: '누들', license: 'Noodles' },
        {
            value: 'CONVENIENCE1',
            label: company === Company.KANGCHON ? '간편식' : '프레시박스',
            license: 'Sandwich, Milk Bottle'
        }
    ];
    const mealTime = ['조식', '중식', '석식'];
    if (company === Company.KANGCHON) {
        return {
            mealTime,
            menu: [
                ...commonMenu,
                { value: 'CONVENIENCE2', label: '간편식', license: 'Sandwich, Milk Bottle' },
                { value: 'CONVENIENCE3', label: '프로틴', license: 'Smoothie' }
            ]
        };
    } else {
        return {
            mealTime,
            menu: commonMenu
        };
    }
};

export const companyDropdownItem = [
    { label: '더존 강촌 캠퍼스', value: 'KANGCHON' },
    { label: '더존 을지타워', value: 'EULJI' }
];

export const companyMealDropdownItem = [
    { label: '강촌 식단', value: 'KANGCHON' },
    { label: '을지 식단', value: 'EULJI' }
];

export enum Company {
    KANGCHON = 'KANGCHON',
    EULJI = 'EULJI'
}

export enum DrinkTemperature {
    HOT = 'HOT',
    ICED = 'ICED'
}

export enum DrinkCategory {
    COFFEE = 'COFFEE',
    TEA = 'TEA',
    DRINK = 'DRINK',
    SEASON = 'SEASON'
}

export interface CafeMenuTab {
    name: string;
    index: number;
    value: DrinkCategory;
}

export const BASE_MENU: CafeMenuTab[] = [
    { name: 'COFFEE', index: 0, value: DrinkCategory.COFFEE },
    { name: 'TEA', index: 1, value: DrinkCategory.TEA },
    { name: 'BEVERAGE', index: 2, value: DrinkCategory.DRINK }
];

export const SEASON_MENU: CafeMenuTab = {
    name: 'SEASON',
    index: 3,
    value: DrinkCategory.SEASON
};

export const titleMap: Record<string, string> = {
    HOT_COFFEE: 'HOT 커피',
    ICED_COFFEE: 'ICE 커피',
    HOT_TEA: 'HOT 차',
    ICED_TEA: 'ICE 차',
    HOT_DRINK: 'HOT 음료',
    ICED_DRINK: 'ICE 음료',
    SEASON: '시즌음료'
};

export const drinkSortOrder = ['HOT_COFFEE', 'ICED_COFFEE', 'HOT_TEA', 'ICED_TEA', 'HOT_DRINK', 'ICED_DRINK', 'SEASON'];

export interface ICommonModalTypes {
    open: boolean;
    onClose?(): void;
    content?: string | ReactNode;
    title?: string;
    onConfirm?(): void;
    confirmText?: string;
    width?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    maxHeight?: string | number;
    fixedContent?: string | ReactNode;
    fixedContentPosition?: 'top' | 'bottom';
    hasCloseButton?: boolean;
    modalType?: string;
}

type BreakpointConfig = {
    min: number;
    max: number;
    fontSize?: number | string;
    chipSize?: number | string;
    iconSize?: number | string;
    maxWidth?: number | string;
    marginTop?: number;
    ellipsisMaxWidth?: number | string;
    cartImgWidthAndHeight?: number;
};

export type PageConfigs = {
    [page: string]: BreakpointConfig[];
};

export interface ClapPosition {
    id: string;
    emoji: string;
    x: number;
    y: number;
    opacity: number;
}

export interface EllipsisTooltipWithChipProps {
    title: string;
    children: React.ReactElement;
    forceTooltip: boolean;
    style?: any;
    customMaxWidthKey: string | number;
    withIcon?: boolean;
}
