export const mealMenu = (company: string) => {
    const commonMenu = [
        { value: 'SPECIAL', label: '일품' },
        { value: 'KOREAN1', label: '한식' },
        { value: 'KOREAN2', label: '라면' },
        {
            value: 'CONVENIENCE1',
            label: company === Company.KANGCHON ? '간편식' : '프레시박스'
        }
    ];
    const mealTime = ['조식', '중식', '석식'];
    if (company === Company.KANGCHON) {
        return {
            mealTime,
            menu: [
                ...commonMenu,
                { value: 'CONVENIENCE2', label: '간편식' },
                { value: 'CONVENIENCE3', label: '프로틴' }
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
    DRINK = 'DRINK'
}
