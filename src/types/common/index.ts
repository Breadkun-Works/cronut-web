export const mealMenu = (company: string) => {
    const commonMenu = [
        { value: 'SPECIAL', label: '일품' },
        { value: 'KOREAN1', label: '한식' },
        { value: 'KOREAN2', label: '라면' },
        {
            value: 'CONVENIENCE1',
            label: company === '강촌' ? '간편식' : '프레시박스'
        }
    ];
    const mealTime = ['조식', '중식', '석식'];
    if (company === '강촌') {
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
